"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Mic } from 'lucide-react'
import dynamic from 'next/dynamic'
import useSpeechToText from 'react-hook-speech-to-text'
import { toast } from "sonner"
import { chatSession } from '@/utils/GeminiAIModal'
import { db } from '@/utils/db'
import { userAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import CodeEditor from "@uiw/react-textarea-code-editor"

const WEBCAM_PLACEHOLDER =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png"

// Dynamically import Webcam so it only loads on client
const DynamicWebcam = dynamic(() => import('react-webcam'), { ssr: false })

function RecordAnswerSection({ mockInterviewQuestions, activeQuestionIndex, interviewData }) {
  // Defensive check for required data
  if (
    !Array.isArray(mockInterviewQuestions) ||
    typeof activeQuestionIndex !== "number" ||
    !mockInterviewQuestions[activeQuestionIndex] ||
    !interviewData ||
    !interviewData.mockId
  ) {
    return (
      <div className="p-8 text-red-500">
        Error: Questions or interview data is not loaded or invalid.
      </div>
    );
  }

  const lastIndex = mockInterviewQuestions.length - 1;
  const isDSA = !!mockInterviewQuestions[lastIndex]?.dsaQuestion;
  const isCurrentDSA = isDSA && activeQuestionIndex === lastIndex;

  // DSA code editor state
  const [userCode, setUserCode] = useState('');
  const [dsaFeedback, setDsaFeedback] = useState('');
  const [dsaLoading, setDsaLoading] = useState(false);

  // Regular answer state
  const [userAnswerText, setUserAnswerText] = useState('')
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [showUserAnswer, setShowUserAnswer] = useState(false)
  const [webcamAllowed, setWebcamAllowed] = useState(true)

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults

  } = typeof window !== "undefined"
    ? useSpeechToText({
        continuous: true,
        useLegacyResults: false
      })
    : {
        error: null,
        interimResult: "",
        isRecording: false,
        results: [],
        startSpeechToText: () => {},
        stopSpeechToText: () => {}
      }

  useEffect(() => {
    if (results && results.length > 0) {
      setUserAnswerText(results.map(r => r.transcript).join(' '))
    }
  }, [results])

  useEffect(() => {
    setUserAnswerText('')
    setShowUserAnswer(false)
    setUserCode('')
    setDsaFeedback('')
  }, [activeQuestionIndex])

  // --- DSA Submission Logic ---
  const handleDSASubmit = async () => {
    setDsaLoading(true)
    try {
      const prompt = `Here is a DSA question: "${mockInterviewQuestions[lastIndex]?.dsaQuestion}". The candidate wrote this pseudocode:\n${userCode}\nGive feedback on correctness, efficiency, and clarity. Respond in JSON with "rating" and "feedback" fields.`
      const result = await chatSession.sendMessage(prompt)
      const text = await result.response.text()
      const mockJsonResp = text.replace('```json', '').replace('```', '')
      const JsonFeedbackResp = JSON.parse(mockJsonResp)
      // Save to DB (optional)
      await db.insert(userAnswer).values({
        mockIdRef: interviewData.mockId,
        question: mockInterviewQuestions[lastIndex]?.dsaQuestion,
        correctAns: mockInterviewQuestions[lastIndex]?.dsaAnswer,
        userAns: userCode,
        feedback: Array.isArray(JsonFeedbackResp?.feedback) ? JsonFeedbackResp.feedback.join('\n') : JsonFeedbackResp?.feedback,
        rating: String(JsonFeedbackResp?.rating ?? ''),
        userEmail: user?.primaryEmailAddress?.emailAddress ?? '',
        createdAt: moment().format('DD-MM-yyyy')
      })
      toast.success("DSA answer saved! Feedback will be shown on the feedback page.");
      setUserCode('');
    } catch (e) {
      toast.error("Failed to get feedback from AI.");
    }
    setDsaLoading(false)
  }

  const handleShowUserAnswer = () => {
    setShowUserAnswer(true)
    console.log('User Answer:', userAnswerText)
  }

  const handleWebcamError = () => setWebcamAllowed(false)

  const feedbackPrompt = "Question: " + mockInterviewQuestions[activeQuestionIndex]?.question + "\nYour Answer: " + userAnswerText + "\nWhich Depends upon set of questions and user answer for the given interview questions" +
    "Please Provide feedback on the answer in a concise manner. As area of improvements, if any." + "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field. ";

  const saveUserAnswer = async () => {
    if (isRecording) {
      setLoading(true);
      stopSpeechToText();
    }
    setLoading(true);
    if (userAnswerText.length < 10) {
      setLoading(false);
      toast.error("Error while saving your answer, Please record again!")
      return
    }
    // Defensive: check for mockId before insert
    if (!interviewData?.mockId) {
      setLoading(false);
      toast.error("Interview ID is missing. Cannot save answer.");
      return;
    }
    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const text = await result.response.text();
      console.log("AI raw response:", text);
      const mockJsonResp = text.replace('```json', '').replace('```', '');
      const JsonFeedbackResp = JSON.parse(mockJsonResp);
      console.log("Parsed feedback:", JsonFeedbackResp);

      const resp = await db.insert(userAnswer)
        .values({
          mockIdRef: interviewData.mockId, // must match schema.js
          question: mockInterviewQuestions[activeQuestionIndex]?.question,
          correctAns: mockInterviewQuestions[activeQuestionIndex]?.answer,
          userAns: userAnswerText,
          feedback: Array.isArray(JsonFeedbackResp?.feedback) ? JsonFeedbackResp.feedback.join('\n') : JsonFeedbackResp?.feedback,
          rating: String(JsonFeedbackResp?.rating ?? ''),
          userEmail: user?.primaryEmailAddress?.emailAddress ?? '',
          createdAt: moment().format('DD-MM-yyyy')
        });

      if (resp) {
        toast.success("Your answer has been saved successfully!");
        setUserAnswerText('');
        setResults([]); // Clear results after saving
      }
      setResults([]); // Clear results after saving
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error("Save error:", e);
      toast.error("Failed to get feedback from AI.");
    }
  }

  if (typeof window !== "undefined" && error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500">Web Speech API is not available in this browser 🤷‍</p>
      </div>
    )
  }

  // --- Render DSA Editor if last question and is DSA ---
  if (isCurrentDSA) {
    return (
      <div className="p-8 border rounded-2xl bg-white shadow-md flex flex-col items-center h-full">
        <h3 className="text-lg font-bold mb-4 text-blue-700">Write your pseudocode answer below:</h3>
        <CodeEditor
          value={userCode}
          language="text"
          placeholder="Write your pseudocode here..."
          onChange={evn => setUserCode(evn.target.value)}
          minHeight={120}
          className="mb-4 w-full rounded-lg border border-blue-200 bg-blue-50"
        />
        <Button
          onClick={handleDSASubmit}
          disabled={dsaLoading || !userCode}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mt-2"
        >
          {dsaLoading ? "Submitting..." : "Submit"}
        </Button>
      </div>
    )
  }

  // --- Render Regular Answer Section ---
  return (
    <div className="p-8 border rounded-2xl bg-white shadow-md flex flex-col items-center h-full">
      <div className="w-80 h-80 bg-black rounded-lg flex items-center justify-center mb-6 overflow-hidden">
        {webcamAllowed ? (
          <DynamicWebcam
            audio={false}
            mirrored={true}
            className="w-full h-full object-cover rounded-lg"
            onUserMediaError={handleWebcamError}
          />
        ) : (
          <img
            src={WEBCAM_PLACEHOLDER}
            alt="Webcam Placeholder"
            className="w-32 h-32 object-contain opacity-80"
          />
        )}
      </div>
      <div className="flex flex-col items-center gap-2 mb-4 w-full">
        <Button
          variant={isRecording ? "destructive" : "default"}
          className="flex items-center gap-2 px-6 py-2 font-semibold w-48 justify-center"
          onClick={isRecording ? stopSpeechToText : startSpeechToText}
        >
          <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse text-red-500' : 'text-primary'}`} />
          {isRecording ? 'Stop Recording' : 'Record Answer'}
        </Button>
        <span className="text-sm text-muted-foreground">
          Recording: <span className={isRecording ? "text-red-500 font-bold" : ""}>{isRecording ? "On" : "Off"}</span>
        </span>
        
        <Button
          disabled={loading}
          variant="outline"
          className="px-4 py-2 font-semibold w-48"
          onClick={saveUserAnswer}
        >
          {loading ? "Saving..." : "Save Answer"}
        </Button>
      </div>
    </div>
  )
}

export default RecordAnswerSection
