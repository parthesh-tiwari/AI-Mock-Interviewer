import { Volume2 } from 'lucide-react'
import React from 'react'

function textToSpeech(text) {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const utterance = new window.SpeechSynthesisUtterance(text)
    window.speechSynthesis.speak(utterance)
  }
}

function QuestionsSection({ mockInterviewQuestions, activeQuestionIndex }) {
  if (!mockInterviewQuestions) return null;

  // Detect if last question is DSA
  const lastIndex = mockInterviewQuestions.length - 1;
  const isDSA = !!mockInterviewQuestions[lastIndex]?.dsaQuestion;

  return (
    <div className="p-6 border rounded-2xl bg-white shadow-md">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        {mockInterviewQuestions.map((question, index) => (
          <h2
            key={index}
            className={`px-3 py-2 border rounded-full text-xs md:text-sm text-center cursor-pointer font-semibold
              ${activeQuestionIndex === index ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-blue-50 text-blue-700'}
              ${isDSA && index === lastIndex ? 'border-green-500' : ''}
            `}
          >
            {isDSA && index === lastIndex ? "DSA Question" : `Question #${index + 1}`}
          </h2>
        ))}
      </div>
      <h2 className="text-lg font-bold mb-2">
        {isDSA && activeQuestionIndex === lastIndex
          ? mockInterviewQuestions[lastIndex]?.dsaQuestion
          : mockInterviewQuestions[activeQuestionIndex]?.question}
      </h2>
      <Volume2
        onClick={() =>
          textToSpeech(
            isDSA && activeQuestionIndex === lastIndex
              ? mockInterviewQuestions[lastIndex]?.dsaQuestion
              : mockInterviewQuestions[activeQuestionIndex]?.question
          )
        }
        className="cursor-pointer inline-block ml-2 text-blue-600"
        title="Listen to question"
      />
    </div>
  );
}

export default QuestionsSection
