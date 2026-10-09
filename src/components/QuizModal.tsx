"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, HelpCircle, Trophy } from "lucide-react";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question: "You receive an SMS saying your electricity will be disconnected at 9:30 PM unless you call an officer. What is the safest action?",
    options: [
      "Call the number immediately to ask for an extension.",
      "Check your bill status exclusively on the official DISCOM website or mobile app.",
      "Download the APK link attached to clear the payment.",
      "Reply with your consumer number to the SMS.",
    ],
    correct: 1,
    explanation: "Official electricity boards never send disconnection notices from personal 10-digit mobile numbers or demand APK downloads.",
  },
  {
    question: "A caller claims to be a Mumbai Police officer saying an illegal passport was mailed in your name and you are under 'Digital Arrest'. What is true?",
    options: [
      "You must stay on Skype video call until you transfer bail money.",
      "Police can arrest you digitally over WhatsApp video call.",
      "'Digital Arrest' has no legal standing in India; police never conduct bail settlements via video calls.",
      "You must send your Aadhaar copy to their personal WhatsApp.",
    ],
    correct: 2,
    explanation: "There is no legal concept called 'Digital Arrest' under Indian law. It is an extortion racket.",
  },
  {
    question: "When is it safe to share an OTP received on your mobile?",
    options: [
      "When a caller claims they are from your bank's fraud department.",
      "When redeeming credit card reward points on a web portal.",
      "Only for authorized doorstep package deliveries, or on the official bank gateway you personally initiated.",
      "When claiming a lottery prize from KBC Jio.",
    ],
    correct: 2,
    explanation: "Banks and telecom operators will never ask for your OTP over phone call or SMS.",
  },
  {
    question: "A Telegram group offers ₹5,000/day for liking YouTube videos and asks for a ₹2,000 'activation deposit'. What is this?",
    options: [
      "A legitimate remote part-time job from an influencer agency.",
      "A classic task-based Ponzi scam; you will lose whatever deposit you transfer.",
      "A government-sponsored youth employment program.",
      "A social media internship with guaranteed returns.",
    ],
    correct: 1,
    explanation: "Legitimate employers never demand an upfront 'security fee' or 'task deposit' to unlock payouts.",
  },
  {
    question: "What is the official national helpline number to report digital financial cybercrime in India?",
    options: [
      "100",
      "1930",
      "112",
      "1091",
    ],
    correct: 1,
    explanation: "1930 is the dedicated National Cyber Financial Helpline operated by the Ministry of Home Affairs.",
  },
];

export function QuizModal({ isOpen, onClose }: QuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-surface-1 border border-border p-6 shadow-2xl my-8 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h3 id="quiz-modal-title" className="text-lg font-bold text-foreground">
              Spot The Scam Quiz
            </h3>
          </div>
          <button
            onClick={onClose}
            className="touch-target text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer"
            aria-label="Close quiz modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!showResult ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Question {currentIdx + 1} of {QUESTIONS.length}</span>
              <span>Score: {score}</span>
            </div>

            <div className="text-sm sm:text-base font-semibold text-foreground leading-relaxed">
              {currentQ.question}
            </div>

            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct;
                const showFeedback = selectedOption !== null;

                let btnStyle = "bg-surface-2 border-border text-foreground hover:border-primary/50";
                if (showFeedback) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-500 font-semibold";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/10 border-rose-500 text-rose-500 font-semibold";
                  } else {
                    btnStyle = "bg-surface-2 border-border-subtle opacity-60";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showFeedback}
                    onClick={() => handleSelect(idx)}
                    className={`touch-target w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />}
                    {showFeedback && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="p-3.5 rounded-xl bg-surface-2 border border-border-subtle text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground block mb-1">Why:</span>
                {currentQ.explanation}
              </div>
            )}

            {selectedOption !== null && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="touch-target px-5 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs cursor-pointer"
                >
                  {currentIdx === QUESTIONS.length - 1 ? "View Final Score" : "Next Question"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-foreground">
                You scored {score} out of {QUESTIONS.length}!
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {score >= 4
                  ? "Outstanding! You have strong cyber hygiene against Indian scam vectors."
                  : "Good effort! Stay vigilant and remember to check suspicious messages on Satark."}
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                onClick={handleReset}
                className="touch-target px-4 py-2 rounded-xl bg-surface-2 border border-border text-xs font-medium cursor-pointer"
              >
                Retake Quiz
              </button>
              <button
                onClick={onClose}
                className="touch-target px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
