"use client"
import { db } from '@/utils/db'
import { MockInterview, userAnswer } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Interview({ params }) {
  const interviewId = params?.interviewId;
  const [interviewData, setInterviewData] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviewAndFeedback = async () => {
      setLoading(true);
      // 1. Get the interview by mockId
      const interviewResult = await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId, interviewId));
      const interview = interviewResult[0];
      setInterviewData(interview);

      // 2. Get feedbacks by mockIdRef (JOIN)
      if (interview) {
        const feedbackResult = await db.select().from(userAnswer)
          .where(eq(userAnswer.mockIdRef, interview.mockId));
        setFeedbackList(feedbackResult);
      }
      setLoading(false);
    };
    if (interviewId) fetchInterviewAndFeedback();
  }, [interviewId]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!interviewData) return <div className="p-10 text-red-500">Interview not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 py-10 px-2 md:px-10">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-extrabold text-3xl md:text-4xl text-gray-800 mb-8 text-left">
          Let's Get Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Interview Details */}
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-gray-200 bg-white shadow-md p-6">
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-bold text-gray-700">Job Role / Job Position:</span>
                <span className="ml-2 text-gray-900">{interviewData?.jobPosition}</span>
              </h2>
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-bold text-gray-700">Job Description / Tech Stack:</span>
                <span className="ml-2 text-gray-900">{interviewData?.jobDesc}</span>
              </h2>
              <h2 className="text-lg font-semibold mb-2">
                <span className="font-bold text-gray-700">Years of Experience:</span>
                <span className="ml-2 text-gray-900">{interviewData?.jobExperience}</span>
              </h2>
            </div>
            {/* Feedbacks */}
            <div className="mt-6">
              <h2 className="font-bold text-xl mb-4">Feedbacks</h2>
              {feedbackList.length === 0 ? (
                <div className="text-gray-500">No feedbacks yet.</div>
              ) : (
                feedbackList.map((fb, idx) => (
                  <div key={fb.id} className="mb-4 p-4 bg-white rounded-lg shadow border">
                    <div className="font-semibold text-blue-700 mb-1">Q: {fb.question}</div>
                    <div className="text-sm mb-1"><span className="font-bold">Your Answer:</span> {fb.userAns}</div>
                    <div className="text-sm mb-1"><span className="font-bold">Correct Answer:</span> {fb.correctAns}</div>
                    <div className="text-sm mb-1"><span className="font-bold">Feedback:</span> {fb.feedback}</div>
                    <div className="text-sm text-yellow-700"><span className="font-bold">Rating:</span> {fb.rating}</div>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* ...your right column (webcam, etc.) */}
        </div>
      </div>
    </div>
  );
}

export default Interview
