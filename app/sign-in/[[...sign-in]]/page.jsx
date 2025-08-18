import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png"
          alt="AI Interview Mocker Logo"
          className="w-16 h-16 mb-4"
        />
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Welcome Back!</h1>
        <p className="text-gray-500 mb-6 text-center">
          Sign in to continue to your AI Interview Mocker dashboard.
        </p>
        <SignIn appearance={{
          elements: {
            card: "shadow-none bg-transparent",
            headerTitle: "text-blue-700 font-bold",
            formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
          }
        }} />
        <p className="mt-6 text-gray-500 text-sm">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-blue-600 hover:underline font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}