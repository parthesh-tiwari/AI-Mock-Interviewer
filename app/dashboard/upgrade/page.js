"use client";
import React, { useState } from 'react';
import { toast } from "sonner";
import { PaidUser } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'
import moment from 'moment';

export default function UpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();

  // Only Free and Professional plans
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      popular: false,
      description: 'Perfect for trying out our platform',
      features: [
        '5 practice sessions per month',
        'Basic AI feedback',
        'Limited question bank',
        'Email support',
        '720p video recording'
      ],
      limitations: [
        'No advanced analytics',
        'No custom questions',
        'No interview scheduling'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 1,
      popular: true,
      description: 'Ideal for serious job seekers',
      features: [
        'Unlimited practice sessions',
        'Advanced AI feedback & scoring',
        'Complete question bank (500+ questions)',
        'Priority email & chat support',
        '1080p video recording',
        'Detailed performance analytics',
        'Custom question creation',
        'Interview scheduling assistant',
        'Resume analysis integration',
        'Progress tracking & goals'
      ],
      limitations: []
    }
  ];

  const handleUpgrade = (plan) => {
    if (plan.id === 'free') {
      toast.info('You are already on the free plan!');
      return;
    }
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  // Razorpay payment handler
  const handleRazorpayPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => openRazorpay();
      script.onerror = () => {
        setIsProcessing(false);
        alert("Failed to load Razorpay. Please check your internet connection.");
      };
      document.body.appendChild(script);
    } else {
      openRazorpay();
    }
  };

  const openRazorpay = async () => {
    setIsProcessing(false);

    try {
      // Fetch payment config from your API
      const res = await fetch('/api/razorpay/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedPlan.price * 100 }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Payment initiation failed:', res.status, errorText);
        throw new Error(`Payment initiation failed: ${res.status} - ${errorText}`);
      }
      
      const paymentConfig = await res.json();
      
      // console.log('Payment config received:', paymentConfig);
      
      if (!paymentConfig.key_id) {
        console.error('Missing key_id in payment config:', paymentConfig);
        throw new Error('Invalid payment configuration received - missing key_id');
      }

      // Razorpay expects 'key', not 'key_id'
      const options = {
        ...paymentConfig,
        key: paymentConfig.key_id, // Set the correct property for Razorpay
        handler: async function (response) {
          try {
            // Mark user as paid via API
            if (user?.primaryEmailAddress?.emailAddress) {
              const paymentResponse = await fetch('/api/payment/success', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userEmail: user.primaryEmailAddress.emailAddress,
                  paymentId: response.razorpay_payment_id,
                  amount: selectedPlan.price * 100
                }),
              });

              if (paymentResponse.ok) {
                toast.success("Payment successful! Welcome to Professional plan!");
              } else {
                console.error('Failed to record payment:', await paymentResponse.text());
                toast.error("Payment successful but there was an issue saving your subscription. Please contact support.");
              }
            } else {
              toast.error("User email not found. Please contact support.");
            }
          } catch (error) {
            console.error('Error recording payment:', error);
            toast.error("Payment successful but there was an issue saving your subscription. Please contact support.");
          }
          setShowPaymentModal(false);
          setSelectedPlan(null);
        },
        prefill: {
          email: user?.primaryEmailAddress?.emailAddress || "test@razorpay.com",
          contact: "9999999999"
        },
        theme: {
          color: "#6366f1"
        }
      };
      delete options.key_id; // Optional: remove key_id to avoid confusion
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      toast.error("Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Choose Your <span className="text-blue-600">Plan</span>
            </h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Unlock your interview potential with AI-powered coaching tailored to your career goals
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 sm:mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-blue-500 lg:scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-2">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl sm:text-5xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm sm:text-base text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUpgrade(plan)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : plan.id === 'free'
                      ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                      : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                  }`}
                  disabled={plan.id === 'free'}
                >
                  {plan.id === 'free' ? 'Current Plan' : `Get ${plan.name}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison - Mobile First Design */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">Feature Comparison</h3>
          
          {/* Mobile Comparison Cards */}
          <div className="lg:hidden space-y-6">
            {[
              {
                feature: 'Practice Sessions',
                free: '5/month',
                pro: 'Unlimited',
                proHighlight: true
              },
              {
                feature: 'AI Feedback Quality',
                free: 'Basic',
                pro: 'Advanced',
                proHighlight: true
              },
              {
                feature: 'Question Bank Access',
                free: 'Limited',
                pro: 'Full (500+)',
                proHighlight: true
              },
              {
                feature: 'Video Quality',
                free: '720p',
                pro: '1080p',
                proHighlight: true
              },
              {
                feature: 'Analytics & Reports',
                free: '✗',
                pro: '✓',
                proHighlight: true,
                freeHighlight: false
              },
              {
                feature: 'Custom Questions',
                free: '✗',
                pro: '✓',
                proHighlight: true,
                freeHighlight: false
              },
              {
                feature: 'Interview Scheduling',
                free: '✗',
                pro: '✓',
                proHighlight: true,
                freeHighlight: false
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-center">{item.feature}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Free</div>
                    <div className={`font-medium ${item.freeHighlight === false ? 'text-red-500' : 'text-gray-700'}`}>
                      {item.free}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Professional</div>
                    <div className={`font-medium ${item.proHighlight ? 'text-green-600' : 'text-gray-700'}`}>
                      {item.pro}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Comparison Table */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Features</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-900">Professional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Practice Sessions</td>
                    <td className="py-4 px-4 text-center text-gray-600">5/month</td>
                    <td className="py-4 px-4 text-center text-green-600 font-medium">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">AI Feedback Quality</td>
                    <td className="py-4 px-4 text-center text-gray-600">Basic</td>
                    <td className="py-4 px-4 text-center text-green-600 font-medium">Advanced</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Question Bank Access</td>
                    <td className="py-4 px-4 text-center text-gray-600">Limited</td>
                    <td className="py-4 px-4 text-center text-green-600 font-medium">Full (500+)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Video Quality</td>
                    <td className="py-4 px-4 text-center text-gray-600">720p</td>
                    <td className="py-4 px-4 text-center text-green-600 font-medium">1080p</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Analytics & Reports</td>
                    <td className="py-4 px-4 text-center text-red-500">✗</td>
                    <td className="py-4 px-4 text-center text-green-600 font-medium">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Custom Questions</td>
                    <td className="py-4 px-4 text-center text-red-500">✗</td>
                    <td className="py-4 px-4 text-center text-green-600 font-medium">✓</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 text-gray-700">Interview Scheduling</td>
                    <td className="py-4 px-4 text-center text-red-500">✗</td>
                    <td className="py-4 px-4 text-center text-green-600 font-medium">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Complete Your Purchase</h3>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{selectedPlan?.name} Plan</span>
                  <span className="font-bold text-blue-600 text-sm sm:text-base">
                    ${selectedPlan?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Only Razorpay Payment Button */}
            <div className="p-4 sm:p-6">
              <button
                type="button"
                className="w-full py-3 px-6 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base"
                disabled={isProcessing}
                onClick={handleRazorpayPayment}
              >
                {isProcessing ? "Processing..." : `Pay with Razorpay`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
