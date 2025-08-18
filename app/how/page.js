"use client";
import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Users, 
  MessageSquare, 
  Camera, 
  BarChart3, 
  Clock, 
  Target, 
  Brain, 
  Mic,
  FileText,
  Award,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useRouter } from "next/navigation";
import Header from '../dashboard/_components/Header';

export default function HowItWorksPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [showDemo, setShowDemo] = useState(false);
  const router = useRouter();

  const steps = [
    {
      number: "1",
      title: "Sign Up & Login",
      description: "Create your account and access your personalized dashboard with ease.",
      details: "Quick registration process with email verification. Access your dashboard immediately after signup.",
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "2",
      title: "Add Interview Role",
      description: "Specify your target role and let our AI understand your interview needs.",
      details: "Enter job title, company, and requirements. Our AI tailors questions to your specific role.",
      icon: <Target className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "3",
      title: "Practice Interview",
      description: "Start your mock interview with webcam recording and AI-generated questions.",
      details: "Real-time practice with video recording, voice analysis, and adaptive questioning.",
      icon: <Play className="w-8 h-8" />,
      color: "from-pink-500 to-pink-600"
    },
    {
      number: "4",
      title: "Get Feedback",
      description: "Receive instant, detailed feedback and track your improvement over time.",
      details: "Comprehensive analysis of your performance with actionable improvement suggestions.",
      icon: <BarChart3 className="w-8 h-8" />,
      color: "from-green-500 to-green-600"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Questions",
      description: "Advanced AI generates role-specific interview questions tailored to your industry and position level."
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Video Recording",
      description: "Practice with real-time video recording to improve your body language and presentation skills."
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Voice Analysis",
      description: "Get feedback on your speaking pace, clarity, and confidence levels during interviews."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Instant Feedback",
      description: "Receive detailed performance analysis and improvement suggestions after each practice session."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and performance metrics."
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Certification Ready",
      description: "Prepare for industry certifications and professional interviews with confidence."
    }
  ];

  const faqs = [
    {
      question: "How does the AI generate questions?",
      answer: "Our AI analyzes millions of real interview questions across different industries and roles. It considers your specific job title, company type, and experience level to generate relevant, challenging questions that mirror real interview scenarios."
    },
    {
      question: "Can I practice multiple times?",
      answer: "Absolutely! You can practice as many times as you want. Each session generates new questions and provides fresh feedback, helping you improve with every practice round."
    },
    {
      question: "How accurate is the feedback?",
      answer: "Our AI feedback system is trained on successful interview patterns and professional communication standards. It analyzes your verbal responses, body language, and overall presentation to provide actionable insights with 85% accuracy rate."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take privacy seriously. All your practice sessions and personal data are encrypted and stored securely. You can delete your data anytime, and we never share your information with third parties."
    },
    {
      question: "What types of interviews can I practice?",
      answer: "You can practice various interview types including behavioral, technical, case study, and industry-specific interviews. Our platform covers over 50+ job roles across different sectors."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">Works?</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Master your interview skills with our AI-powered coaching system. Follow these simple steps to transform your interview performance and land your dream job.
          </p>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and see immediate improvement in your interview skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent transform translate-x-4 z-0"></div>
                )}
                
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Step Number */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto shadow-lg`}>
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="flex justify-center mb-4 text-gray-700">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500 text-center">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to ace your next interview
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how our AI coaching transforms your interview performance
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-1 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Real-Time Feedback
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Instant response analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Body language assessment</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Voice tone evaluation</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Improvement suggestions</span>
                    </div>
                  </div>
                  <button
                    className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    onClick={() => setShowDemo(true)}
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Demo</span>
                  </button>
                </div>
                <div className="bg-gray-100 rounded-xl p-8 min-h-64 flex items-center justify-center">
                  {showDemo ? (
                    <div className="w-full">
                      <div className="aspect-w-16 aspect-h-9">
                        <iframe
                          width="100%"
                          height="250"
                          src="https://www.youtube.com/embed/2lAe1cqCOXo"
                          title="AI Interview Demo"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-lg"
                        ></iframe>
                      </div>
                      <button
                        className="mt-4 text-blue-600 underline text-sm"
                        onClick={() => setShowDemo(false)}
                      >
                        Hide Demo
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Interactive Demo</p>
                      <p className="text-sm text-gray-400 mt-2">Click "Start Demo" to begin</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our AI Interview Coach
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  {expandedFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-8 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed their dream jobs with our AI Interview Coach.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
              onClick={() => router.push("/dashboard")}
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              onClick={() => router.push("/dashboard/upgrade")}
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AI Interview Mocker</span>
          </div>
          <p className="text-center text-gray-400">
            © 2025 AI Interview Mocker. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}