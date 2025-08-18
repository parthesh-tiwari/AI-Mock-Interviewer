"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/GeminiAIModal";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Header from '../dashboard/_components/Header'

export default function QuestionsPage() {
  const router = useRouter();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('faq');
  const [selectedRole, setSelectedRole] = useState('software-engineer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showIdealAnswer, setShowIdealAnswer] = useState({});
  const [userPracticeAnswer, setUserPracticeAnswer] = useState({});
  const [aiFeedback, setAiFeedback] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Contact form submit with toast
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    toast.success("Message sent! Our team will get back to you soon.");
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const faqs = [
    {
      question: "How does AI Mock Interviewer work?",
      answer: "Our AI analyzes your target role and experience level to generate personalized interview questions. You practice with webcam recording, and our AI provides instant feedback on your responses, body language, and overall performance."
    },
    {
      question: "What types of interviews can I practice?",
      answer: "We support behavioral, technical, situational, and leadership interviews across 50+ job roles including software engineering, marketing, sales, finance, healthcare, and more."
    },
    {
      question: "Is my practice data secure and private?",
      answer: "Absolutely! All your practice sessions, recordings, and personal data are encrypted and stored securely. We never share your information with third parties."
    },
    {
      question: "Can I practice for specific companies?",
      answer: "Yes! Our AI can simulate interview styles for major companies like Google, Amazon, Microsoft, and hundreds of others, tailoring questions to their known interview patterns."
    },
    {
      question: "What's included in the feedback?",
      answer: "You'll receive detailed analysis on your response quality, communication skills, confidence level, eye contact, speech pace, and specific suggestions for improvement."
    },
    {
      question: "Do you offer team or corporate plans?",
      answer: "Yes, we have enterprise solutions for companies looking to help their employees with internal interviews, promotions, or career development."
    }
  ];

  const sampleQuestions = {
    'software-engineer': [
      "Tell me about a challenging bug you had to debug and how you approached it.",
      "How would you design a system to handle 1 million concurrent users?",
      "Describe a time when you had to learn a new technology quickly for a project.",
      "Walk me through your process for code reviews and ensuring code quality."
    ],
    'marketing-manager': [
      "How would you develop a go-to-market strategy for a new product?",
      "Describe a campaign that didn't perform as expected and what you learned.",
      "How do you measure the ROI of different marketing channels?",
      "Tell me about a time you had to pivot your marketing strategy mid-campaign."
    ],
    'product-manager': [
      "How do you prioritize features when resources are limited?",
      "Describe a time when you had to make a difficult product decision.",
      "How would you handle conflicting feedback from different stakeholders?",
      "Walk me through your process for launching a new feature."
    ],
    'sales-representative': [
      "Tell me about a deal you lost and what you learned from it.",
      "How do you handle objections from potential clients?",
      "Describe your approach to building relationships with new prospects.",
      "How do you manage your sales pipeline and prioritize leads?"
    ]
  };

  const roles = [
    { id: 'software-engineer', name: 'Software Engineer' },
    { id: 'marketing-manager', name: 'Marketing Manager' },
    { id: 'product-manager', name: 'Product Manager' },
    { id: 'sales-representative', name: 'Sales Representative' }
  ];

  // Handle "Start Free Trial" and "View Pricing"
  const handleStartFreeTrial = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-in");
    }
  };
  const handleViewPricing = () => router.push("/dashboard/upgrade");

  // Show ideal answer for a sample question (per question)
  const handleShowIdealAnswer = (question) => {
    const idealAnswers = {
      "Tell me about a challenging bug you had to debug and how you approached it.": "An ideal answer would describe the bug, your debugging process, tools used, collaboration, and the final resolution, highlighting problem-solving and communication skills.",
      "How would you design a system to handle 1 million concurrent users?": "Discuss scalability, load balancing, caching, database sharding, stateless services, and monitoring. Mention trade-offs and reliability.",
      "Describe a time when you had to learn a new technology quickly for a project.": "Share the context, how you approached learning, resources used, and how you applied the knowledge to succeed.",
      "Walk me through your process for code reviews and ensuring code quality.": "Explain your code review steps, tools, collaboration, and how you ensure maintainability and best practices.",
      // ...add more for other roles/questions...
    };
    setShowIdealAnswer((prev) => ({
      ...prev,
      [question]: idealAnswers[question] || "An ideal answer would be concise, structured, and relevant to the question.",
    }));
  };

  // Handle AI feedback for user's practice answer (per question)
  const handleGetFeedback = async (question) => {
    setLoadingFeedback((prev) => ({ ...prev, [question]: true }));
    setAiFeedback((prev) => ({ ...prev, [question]: null }));
    try {
      const feedbackPrompt =
        `Question: ${question}\n` +
        `Ideal Answer: ${showIdealAnswer[question] || ''}\n` +
        `User Answer: ${userPracticeAnswer[question] || ''}\n` +
        "Please provide feedback on the user's answer in 3 to 5 lines, focusing on strengths and areas for improvement. Respond in JSON format with 'rating' (1-5) and 'feedback' fields.";
      const result = await chatSession.sendMessage(feedbackPrompt);
      const text = await result.response.text();
      const mockJsonResp = text.replace('```json', '').replace('```', '');
      const JsonFeedbackResp = JSON.parse(mockJsonResp);
      setAiFeedback((prev) => ({ ...prev, [question]: JsonFeedbackResp }));
    } catch (e) {
      toast.error("Failed to get feedback from AI.");
    }
    setLoadingFeedback((prev) => ({ ...prev, [question]: false }));
  };

  // Helper for feedback color
  const getFeedbackColor = (rating) => {
    if (rating <= 1) return "bg-red-50 text-red-700 border-red-200";
    if (rating <= 3) return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Have <span className="text-blue-600">Questions</span>?
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers about AI Mock Interviewer, explore FAQs and sample questions, or try our AI-powered interview experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-200 w-full max-w-3xl">
            <div className="flex flex-col sm:flex-row">
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  activeTab === 'faq'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                FAQ
              </button>
              <button
                onClick={() => setActiveTab('sample')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  activeTab === 'sample'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sample Questions
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  activeTab === 'contact'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 text-sm sm:text-base">Everything you need to know about AI Mock Interviewer</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white text-center">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-blue-100 mb-6 text-sm sm:text-base">
                Our support team is here to help you succeed in your interview preparation journey
              </p>
              <button
                onClick={() => setActiveTab('contact')}
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}

        {/* Sample Questions Section */}
        {activeTab === 'sample' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Experience Our AI-Generated Questions</h2>
              <p className="text-gray-600 text-sm sm:text-base">See the quality and variety of interview questions our AI creates for different roles</p>
            </div>

            {/* Role Selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-xl shadow-sm p-1 border border-gray-200 w-full max-w-4xl overflow-x-auto">
                <div className="flex min-w-max sm:min-w-0">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap ${
                        selectedRole === role.id
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Questions Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
              {sampleQuestions[selectedRole].map((question, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        AI Generated
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-900 font-medium leading-relaxed text-sm sm:text-base mb-4">{question}</p>
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      onClick={() => handleShowIdealAnswer(question)}
                    >
                      Show Ideal Answer
                    </button>
                    {showIdealAnswer[question] && (
                      <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-700">
                        <strong>Ideal Answer:</strong> {showIdealAnswer[question]}
                      </div>
                    )}
                    <textarea
                      className="w-full p-3 border rounded-lg text-sm resize-none"
                      rows={4}
                      placeholder="Type your answer here to get instant AI feedback..."
                      value={userPracticeAnswer[question] || ''}
                      onChange={e =>
                        setUserPracticeAnswer((prev) => ({
                          ...prev,
                          [question]: e.target.value,
                        }))
                      }
                    />
                    <button
                      className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow transition text-sm"
                      disabled={loadingFeedback[question] || !(userPracticeAnswer[question] && userPracticeAnswer[question].length > 0)}
                      onClick={() => handleGetFeedback(question)}
                    >
                      {loadingFeedback[question] ? "Getting Feedback..." : "Get AI Feedback"}
                    </button>
                    {aiFeedback[question] && (
                      <div className={`rounded-lg p-3 text-sm border ${getFeedbackColor(aiFeedback[question].rating)}`}>
                        <strong>AI Feedback:</strong> {aiFeedback[question].feedback}
                        <div className="mt-1">Rating: <span className="font-bold">{aiFeedback[question].rating}/5</span></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Try Now Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Ready to Experience the Full Power?</h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                  Try our complete AI interview experience with personalized questions, webcam practice, and instant feedback
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="px-6 sm:px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    onClick={handleStartFreeTrial}
                  >
                    Start Free Trial
                  </button>
                  <button
                    className="px-6 sm:px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    onClick={handleViewPricing}
                  >
                    View Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 text-sm sm:text-base">Have a specific question? We're here to help you succeed</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Contact Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="feature">Feature Request</option>
                      <option value="enterprise">Enterprise Solutions</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base resize-none"
                      placeholder="Tell us how we can help you..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Email Support</h4>
                      <p className="text-gray-600 text-sm sm:text-base">support@aimockinterviewer.com</p>
                      <p className="text-xs sm:text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Live Chat on Email</h4>
                      <p className="text-gray-600 text-sm sm:text-base">Available 24/7</p>
                      <p className="text-xs sm:text-sm text-gray-500">Get instant answers</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Knowledge Base</h4>
                      <p className="text-gray-600 text-sm sm:text-base">Self-service resources</p>
                      <p className="text-xs sm:text-sm text-gray-500">Guides, tutorials & FAQs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}