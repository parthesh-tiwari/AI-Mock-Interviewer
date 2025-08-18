'use client'

import React, { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import QuestionsSection from './_components/QuestionsSection'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

// Dynamically import the code editor and video cam
const RecordAnswerSection = dynamic(() => import('./_components/RecordAnswerSection'), { ssr: false })
// const FloatingVideoCam = dynamic(() => import('./_components/FloatingVideoCam'), { ssr: false })

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

function StartInterview({ interviewId }) {
  const [interviewData, setInterviewData] = useState(null)
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState(null)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [remainingSeconds, setRemainingSeconds] = useState(45 * 60) // 45 minutes
  const timerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (!interviewId) return
    setLoading(true)
    setError(null)
    db.select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId))
      .then((result) => {
        if (!result || !result[0]) {
          setError('Interview not found')
          setLoading(false)
          return
        }
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        setMockInterviewQuestions(jsonMockResp)
        setInterviewData(result[0])
        setLoading(false)
      })
      .catch((err) => {
        setError('Failed to load interview')
        setLoading(false)
      })
  }, [interviewId])

  // Timer logic
  useEffect(() => {
    if (loading || error) return
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          // Auto-finish interview
          router.replace(`/dashboard/interview/${interviewData?.mockId ?? ''}/feedback`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line
  }, [loading, error, interviewData])

  if (loading) return <div className='p-10'>Loading...</div>
  if (error) return <div className='p-10 text-red-500'>{error}</div>
  if (!mockInterviewQuestions) return <div className='p-10'>No questions found.</div>

  // --- Resizable Layout ---
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Timer Bar */}
      <div className="flex justify-between items-center px-6 pt-6 pb-2 bg-white shadow-sm z-10">
        <div>
          <span className="text-lg font-semibold text-gray-700">
            Interview Timer:
          </span>
          <span className={`ml-3 text-2xl font-mono font-bold ${remainingSeconds < 60 ? "text-red-600" : "text-blue-700"}`}>
            {formatTime(remainingSeconds)}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-400">Total Time: 45:00</span>
        </div>
      </div>

      {/* Main Resizable Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 md:gap-0 px-1 md:px-2 py-2 md:py-2 overflow-hidden relative">
        {/* Left: Questions (Resizable) */}
        <div
          className="resize-x overflow-auto min-w-[280px] max-w-full md:max-w-[50vw] bg-white rounded-l-2xl shadow-md"
          style={{ minHeight: 0 }}
        >
          <QuestionsSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
          />
        </div>
        {/* Divider for resizing */}
        <div className="hidden md:block w-2 cursor-col-resize bg-gradient-to-b from-blue-100 to-purple-100" />
        {/* Right: Answer Section (Resizable) */}
        <div
          className="flex-1 min-w-0 bg-white rounded-r-2xl shadow-md relative overflow-auto"
          style={{ minHeight: 0 }}
        >
          <RecordAnswerSection
            mockInterviewQuestions={mockInterviewQuestions}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
          />
        </div>
      </div>

      {/* Sticky Button Bar */}
      <div className="sticky bottom-0 left-0 w-full bg-white shadow-inner py-3 px-4 flex flex-wrap gap-3 justify-end items-center z-20">
        {activeQuestionIndex > 0 && (
          <Button onClick={() => setActiveQuestionIndex((prev) => prev - 1)}>
            Previous Question
          </Button>
        )}
        {mockInterviewQuestions && activeQuestionIndex < mockInterviewQuestions.length - 1 && (
          <Button onClick={() => setActiveQuestionIndex((prev) => prev + 1)}>
            Next Question
          </Button>
        )}
        {mockInterviewQuestions && activeQuestionIndex === mockInterviewQuestions.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId ?? ''}/feedback`}>
            <Button className='bg-green-500 hover:bg-green-600'>
              Finish Interview
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default StartInterview
