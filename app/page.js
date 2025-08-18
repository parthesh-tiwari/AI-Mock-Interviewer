"use client";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowRight, Brain, Target, Users, CheckCircle, Star, Play, Menu, X, Zap, Shield, TrendingUp, Globe, Award, Clock, Video, Mic, BarChart3, Rocket, Sparkles } from 'lucide-react';
import Header from "./dashboard/_components/Header";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    if (typeof window !== "undefined") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center py-20 px-4 sm:px-6 lg:px-8">
            {/* New Release Banner */}
            <div className={`flex justify-center mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-semibold text-sm sm:text-base">🚀 New Release</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                <button 
                  onClick={() => scrollToSection("features")} 
                  className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 bg-transparent border-none group-hover:scale-105 transition-transform text-sm sm:text-base min-h-[44px] px-2"
                >
                  <span>See what's new</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </button>
              </div>
            </div>

            {/* Main Hero Content */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
                Your Personal{' '}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  AI Interview Coach
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
                Master your interviews with AI-powered coaching. Practice with realistic questions, 
                get instant feedback, and land your dream job with confidence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 px-4 sm:px-0">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <button className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-4 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg min-h-[56px] sm:min-h-[60px]">
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </button>
                </Link>
                <button
                  className="group w-full sm:w-auto border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-4 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:border-blue-300 hover:text-blue-600 transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl min-h-[56px] sm:min-h-[60px]"
                  onClick={() => router.push('/how')}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>Watch Demo</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Stats Preview */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-blue-600">10K+</div>
                <div className="text-sm text-gray-600">Interviews</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-purple-600">85%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-indigo-600">50+</div>
                <div className="text-sm text-gray-600">Job Roles</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="text-2xl font-bold text-pink-600">24/7</div>
                <div className="text-sm text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 sm:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Interview Coach?
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Experience the most realistic interview practice with cutting-edge AI technology and personalized coaching.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200/50">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-700">AI-Powered Questions</h3>
                <p className="text-gray-600 leading-relaxed">Get realistic, role-specific questions generated by advanced AI models tailored to your experience and industry.</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200/50">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-purple-700">Practice with Webcam</h3>
                <p className="text-gray-600 leading-relaxed">Simulate real interviews with HD video recording, audio capture, and get comfortable with camera presence.</p>
              </div>

              <div className="group bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-200/50">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-pink-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-pink-700">Instant Feedback</h3>
                <p className="text-gray-600 leading-relaxed">Get actionable feedback, detailed ratings, and improvement suggestions to boost your confidence.</p>
              </div>

              <div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-indigo-200/50">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-indigo-700">Performance Analytics</h3>
                <p className="text-gray-600 leading-relaxed">Track your progress with detailed analytics, performance trends, and personalized improvement insights.</p>
              </div>

              <div className="group bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-emerald-200/50">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-emerald-700">Privacy First</h3>
                <p className="text-gray-600 leading-relaxed">Your data is encrypted and secure. Practice with confidence knowing your privacy is protected.</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-200/50">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-4 text-orange-700">Lightning Fast</h3>
                <p className="text-gray-600 leading-relaxed">Get instant responses and feedback. No waiting, no delays - just pure interview practice efficiency.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-20 sm:py-32 bg-gradient-to-br from-slate-50 to-blue-50 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-center">
              How it{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Works?
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
              <div className="group text-center relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-700">Sign Up & Login</h3>
                <p className="text-gray-600 leading-relaxed">Create your account and access your personalized dashboard with ease.</p>
              </div>

              <div className="group text-center relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-700">Add Interview Role</h3>
                <p className="text-gray-600 leading-relaxed">Specify your target role and let our AI generate relevant, challenging questions.</p>
              </div>

              <div className="group text-center relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-700">Practice Interview</h3>
                <p className="text-gray-600 leading-relaxed">Start your mock interview with webcam recording and answer AI-generated questions.</p>
              </div>

              <div className="group text-center relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  4
                </div>
                <h3 className="font-bold text-xl mb-4 text-blue-700">Get Feedback</h3>
                <p className="text-gray-600 leading-relaxed">Receive instant, detailed feedback and track your improvement over time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 sm:py-32 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-12 sm:mb-16 text-center">
              What Our{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Users Say
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              <div className="group bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-200/50">
                <div className="flex items-center mb-6">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" width={64} height={64} alt="User1" className="rounded-full mr-4 ring-4 ring-blue-100" />
                  <div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="font-semibold text-blue-700">Amit S.</div>
                    <div className="text-sm text-gray-500">Software Engineer</div>
                  </div>
                </div>
                <p className="italic text-gray-600 leading-relaxed">"The AI questions were spot on for my role. I felt super confident in my real interview and got the job! The feedback was incredibly detailed and actionable."</p>
              </div>

              <div className="group bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200/50">
                <div className="flex items-center mb-6">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" width={64} height={64} alt="User2" className="rounded-full mr-4 ring-4 ring-purple-100" />
                  <div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="font-semibold text-purple-700">Priya K.</div>
                    <div className="text-sm text-gray-500">Product Manager</div>
                  </div>
                </div>
                <p className="italic text-gray-600 leading-relaxed">"Loved the instant feedback and webcam practice. It felt like a real interview experience! The analytics helped me track my progress perfectly."</p>
              </div>

              <div className="group bg-gradient-to-br from-pink-50 to-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-pink-200/50">
                <div className="flex items-center mb-6">
                  <img src="https://randomuser.me/api/portraits/men/65.jpg" width={64} height={64} alt="User3" className="rounded-full mr-4 ring-4 ring-pink-100" />
                  <div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="font-semibold text-pink-700">Rahul D.</div>
                    <div className="text-sm text-gray-500">Data Scientist</div>
                  </div>
                </div>
                <p className="italic text-gray-600 leading-relaxed">"Helped me land my dream job at a top tech company. The role-specific questions and detailed feedback made all the difference. Highly recommend!"</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 sm:py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center text-white">
              <div className="group">
                <div className="text-4xl sm:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">10,000+</div>
                <div className="text-blue-200 font-medium">Successful Interviews</div>
              </div>
              <div className="group">
                <div className="text-4xl sm:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">85%</div>
                <div className="text-blue-200 font-medium">Success Rate</div>
              </div>
              <div className="group">
                <div className="text-4xl sm:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-blue-200 font-medium">Job Roles Covered</div>
              </div>
              <div className="group">
                <div className="text-4xl sm:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">24/7</div>
                <div className="text-blue-200 font-medium">AI Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Upgrade CTA */}
        <section className="py-20 sm:py-32 bg-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-gray-900">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Ace Your Next Interview?
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of job seekers who have successfully landed their dream jobs with our AI interview coach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg min-h-[56px] sm:min-h-[60px]">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform flex-shrink-0" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </button>
              </Link>
              <Link href="/dashboard/upgrade" className="w-full sm:w-auto">
                <button className="group w-full sm:w-auto border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl min-h-[56px] sm:min-h-[60px]">
                  <span className="flex items-center justify-center space-x-2">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span>View Pricing</span>
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg">AI Interview Mocker</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Your personal AI interview coach to help you land your dream job with confidence and skill.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-lg">Product</h3>
              <div className="space-y-3">
                <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white block bg-transparent border-none text-left transition-colors duration-200">Dashboard</button>
                <button onClick={() => router.push("/dashboard/questions")} className="text-gray-400 hover:text-white block bg-transparent border-none text-left transition-colors duration-200">Questions</button>
                <button onClick={() => router.push("/dashboard/upgrade")} className="text-gray-400 hover:text-white block bg-transparent border-none text-left transition-colors duration-200">Pricing</button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Company</h3>
              <div className="space-y-3">
                <button onClick={() => scrollToSection("features")} className="text-gray-400 hover:text-white block bg-transparent border-none text-left transition-colors duration-200">Features</button>
                <button onClick={() => scrollToSection("how-it-works")} className="text-gray-400 hover:text-white block bg-transparent border-none text-left transition-colors duration-200">How it Works</button>
                <a href="#" className="text-gray-400 hover:text-white block transition-colors duration-200">Contact</a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-lg">Support</h3>
              <div className="space-y-3">
                <a href="#" className="text-gray-400 hover:text-white block transition-colors duration-200">Help Center</a>
                <a href="#" className="text-gray-400 hover:text-white block transition-colors duration-200">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white block transition-colors duration-200">Terms of Service</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Interview Mocker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
