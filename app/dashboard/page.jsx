"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Brain, Calendar, TrendingUp, Clock, Plus, User } from 'lucide-react';
import AddNewInterview from './_components/AddNewInterview';
import InterviewList from './_components/InterviewList';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import { userAnswer } from '@/utils/schema';

// Dashboard Stats Component
function DashboardStats({ interviewCount, user, questionsAnswered, questionsAsked, avgFeedback }) {
  const stats = [
    {
      title: "Total Interviews",
      value: interviewCount || 0,
      icon: <Brain className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      title: "This Month",
      value: interviewCount, // For demo, same as total
      icon: <Calendar className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      title: "Avg Feedback",
      value: avgFeedback,
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      title: "Practice Time",
      value: interviewCount > 0 ? `${interviewCount * 5}m` : "—",
      icon: <Clock className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl p-4 sm:p-6 border border-white shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Dashboard() {
  const { user } = useUser();
  const [interviewList, setInterviewList] = useState([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [avgFeedback, setAvgFeedback] = useState('—');

  useEffect(() => {
    if (user) {
      GetInterviewList();
      GetUserAnswerStats();
    }
    // eslint-disable-next-line
  }, [user]);

  // Fetch interview list as before
  const GetInterviewList = async () => {
    const result = await db.select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(MockInterview.id));
    setInterviewList(result);
  };

  // Fetch user answer stats for avg feedback
  const GetUserAnswerStats = async () => {
    const result = await db.select()
      .from(userAnswer)
      .where(eq(userAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));
    const totalQuestions = result.length;
    const answeredQuestions = result.filter(
      (row) => row.userAns && row.userAns.trim() !== ''
    ).length;
    setQuestionsAsked(totalQuestions);
    setQuestionsAnswered(answeredQuestions);
    // Calculate avg feedback (ratings out of 5, display out of 10)
    const validRatings = result
      .map(row => parseFloat(row.rating))
      .filter(r => !isNaN(r));
    const avg = validRatings.length > 0
      ? (validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length * 2).toFixed(1)
      : '—';
    setAvgFeedback(avg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName || "User"}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to ace your next interview? Let's practice together.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <DashboardStats interviewCount={interviewList.length} user={user} questionsAnswered={questionsAnswered} questionsAsked={questionsAsked} avgFeedback={avgFeedback} />

        {/* Create New Interview Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Interview</h2>
            <p className="text-gray-600">Start your AI-powered practice session</p>
          </div>
          <AddNewInterview />
        </div>

        {/* Interview List */}
        <InterviewList />
      </div>
    </div>
  );
}

export default Dashboard
