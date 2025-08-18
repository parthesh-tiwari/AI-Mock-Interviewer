"use client"
import { userAnswer } from '@/utils/schema'
import React, { useEffect } from 'react'
import { db } from '@/utils/db'
import { eq } from 'drizzle-orm'
import { use } from 'react'
import { useRouter } from 'next/navigation'
// Importing UI components for collapsible sections
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
    ChevronsUpDown, 
    Trophy, 
    Target, 
    CheckCircle, 
    XCircle, 
    Lightbulb, 
    Home,
    Star,
    TrendingUp,
    MessageSquare,
    Brain,
    Award,
    BarChart3
} from 'lucide-react'
import { Button } from "@/components/ui/button";

function Feedback({ params }) {
    const { interviewId } = use(params);
    const [feedbackList, setFeedbackList] = React.useState([]);
    const router = useRouter();
    
    useEffect(() => {
        if (interviewId) {
            GetFeedback();
        }
        // eslint-disable-next-line
    }, [interviewId]);

    const GetFeedback = async () => {
        const result = await db.select()
            .from(userAnswer)
            .where(eq(userAnswer.mockIdRef, interviewId))
            .orderBy(userAnswer.id);

        console.log(result);
        setFeedbackList(result);
    }

    // Calculate average rating (ratings are out of 5, display out of 10)
    const validRatings = feedbackList
        .map(item => parseFloat(item.rating))
        .filter(r => !isNaN(r));
    const averageRating = validRatings.length > 0
        ? (validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length * 2).toFixed(1)
        : 0;

    // Helper to display per-question rating out of 10
    const displayRating = (r) => {
        const num = parseFloat(r);
        if (isNaN(num)) return '—';
        return (num * 2).toFixed(1);
    };

    // Get rating color based on score
    const getRatingColor = (rating) => {
        const numRating = parseFloat(rating);
        if (numRating >= 8) return 'text-green-600 bg-green-50 border-green-200';
        if (numRating >= 6) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getOverallRatingColor = (rating) => {
        const numRating = parseFloat(rating);
        if (numRating >= 8) return 'from-green-500 to-emerald-600';
        if (numRating >= 6) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">AI Interview Mocker</h1>
                            <p className="text-xs sm:text-sm text-gray-500">Interview Feedback Report</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
                {/* Congratulations Hero Section */}
                <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-2xl p-4 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">Congratulations!</h2>
                            <p className="text-base sm:text-xl text-green-100">You've completed your AI interview practice session</p>
                        </div>
                    </div>
                </div>

                {/* Status and Overall Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Interview Status</h3>
                        </div>
                        {feedbackList?.length === 0 ? (
                            <div className="flex items-center gap-2">
                                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                                <span className="text-red-600 font-medium text-sm sm:text-base">No feedback available for this interview.</span>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                    <span className="text-green-600 font-medium text-sm sm:text-base">Feedback available for this interview</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {feedbackList.length} questions analyzed with detailed feedback
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Overall Rating Card */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Overall Performance</h3>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${getOverallRatingColor(averageRating)} rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg`}>
                                {averageRating}
                            </div>
                            <div>
                                <p className="text-lg sm:text-2xl font-bold text-gray-900">{averageRating}/10</p>
                                <p className="text-xs sm:text-sm text-gray-500">Average Interview Rating</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                    <div className="flex items-start gap-2 sm:gap-3">
                        <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1 sm:mb-2 text-sm sm:text-base">How to Use This Feedback</h3>
                            <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
                                Below you'll find detailed analysis for each interview question including your answer, 
                                the ideal response, individual ratings, and personalized improvement suggestions. 
                                Click on each question to expand and review the feedback.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Feedback Questions */}
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                        <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Detailed Question Feedback</h3>
                    </div>

                    {feedbackList && feedbackList.map((item, index) => (
                        <Collapsible key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            <CollapsibleTrigger className="w-full p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors duration-200">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div className="flex-1 pr-0 sm:pr-4">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                            <span className="bg-blue-100 text-blue-600 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">
                                                Q{index + 1}
                                            </span>
                                            <span className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full border ${getRatingColor(item.rating)}`}>
                                                {displayRating(item.rating)}/10
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 text-base sm:text-lg leading-relaxed">
                                            {item.question}
                                        </h4>
                                    </div>
                                    <ChevronsUpDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                                </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                                        {/* Your Answer */}
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4">
                                                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                                                    <h5 className="font-semibold text-red-900 text-xs sm:text-base">Your Answer</h5>
                                                </div>
                                                <p className="text-red-800 text-xs sm:text-sm leading-relaxed">
                                                    {item.userAns || "No answer provided"}
                                                </p>
                                            </div>

                                            <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-4">
                                                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                                                    <h5 className="font-semibold text-green-900 text-xs sm:text-base">Suggested Answer</h5>
                                                </div>
                                                <p className="text-green-800 text-xs sm:text-sm leading-relaxed">
                                                    {item.correctAns}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Rating and Feedback */}
                                        <div className="space-y-3 sm:space-y-4">
                                            <div className={`border rounded-xl p-3 sm:p-4 ${getRatingColor(item.rating)}`}>
                                                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                                    <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    <h5 className="font-semibold text-xs sm:text-base">Performance Rating</h5>
                                                </div>
                                                <div className="flex items-center gap-1 sm:gap-2">
                                                    <span className="text-lg sm:text-2xl font-bold">{displayRating(item.rating)}</span>
                                                    <span className="text-xs sm:text-sm font-medium">/10</span>
                                                </div>
                                            </div>

                                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 sm:p-4">
                                                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                                                    <h5 className="font-semibold text-yellow-900 text-xs sm:text-base">Improvement Feedback</h5>
                                                </div>
                                                <p className="text-yellow-800 text-xs sm:text-sm leading-relaxed">
                                                    {item.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 justify-center">
                    <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                        onClick={() => router.replace('/dashboard')}
                    >
                        <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-base">Back to Dashboard</span>
                    </Button>
                    
                    <Button
                        variant="outline"
                        className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                        onClick={() => router.push(`/dashboard/interview/${interviewId}/start`)}
                    >
                        <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-base">Practice Again</span>
                    </Button>
                </div>

                {/* Bottom Tips */}
                {feedbackList.length > 0 && (
                    <div className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                        <div className="flex items-start gap-2 sm:gap-3">
                            <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-purple-900 mb-1 sm:mb-2 text-sm sm:text-base">💡 Pro Tips for Improvement</h3>
                                <ul className="text-purple-800 text-xs sm:text-sm space-y-1">
                                    <li>• Review the suggested answers to understand ideal response structure</li>
                                    <li>• Practice similar questions to improve your confidence and delivery</li>
                                    <li>• Focus on areas where you scored below 7/10 for maximum improvement</li>
                                    <li>• Record yourself practicing to improve body language and speaking pace</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Feedback