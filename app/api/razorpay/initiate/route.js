import Razorpay from "razorpay";

export async function POST(req) {
  const { amount } = await req.json();

  // Validate environment variables
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
    console.error('Missing Razorpay environment variables:', {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      hasPublicKeyId: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    });
    return new Response(
      JSON.stringify({ error: 'Payment service configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  let order;
  try {
    order = await instance.orders.create({
      amount: amount,
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create payment order' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount,
      currency: "INR",
      order_id: order.id,
      name: "Your Company Name",
      description: "Upgrade to Professional Plan",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
