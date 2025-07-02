import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { QuizQuestion as QuizQuestionType } from "@shared/schema";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  totalQuestions: number;
  score: number;
  onAnswer: (selectedAnswer: number) => Promise<any>;
  onEnd: () => void;
  onNext?: () => void;
}

export function QuizQuestion({ 
  question, 
  questionIndex, 
  totalQuestions, 
  score, 
  onAnswer, 
  onEnd,
  onNext 
}: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; explanation: string; points: number } | null>(null);

  const handleSubmit = async () => {
    if (selectedAnswer === null || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      console.log("Submitting answer:", selectedAnswer, "for question:", question.id);
      const response = await onAnswer(selectedAnswer);
      console.log("Got response:", response);
      
      if (response && typeof response === 'object') {
        setResult({
          correct: response.correct,
          explanation: response.explanation,
          points: response.points || 0
        });
        setShowResult(true);
      } else {
        console.error("Invalid response format:", response);
        // 設置一個默認回應以便用戶可以繼續
        setResult({
          correct: false,
          explanation: "提交成功，但回應格式異常",
          points: 0
        });
        setShowResult(true);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      // 設置一個錯誤回應
      setResult({
        correct: false,
        explanation: "提交答案時發生錯誤，請稍後再試",
        points: 0
      });
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (questionIndex >= totalQuestions - 1) {
      onEnd();
    } else {
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
      
      // 觸發下一題的載入
      if (onNext) {
        onNext();
      }
    }
  };

  const progressPercentage = ((questionIndex + 1) / totalQuestions) * 100;

  if (showResult && result) {
    return (
      <div className="fade-in min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-[hsl(var(--primary-500))] px-4 pt-6 pb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onEnd} className="p-1">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">測驗結果</h1>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {result.correct ? "正確！" : "答錯了"}
            </div>
            <div className="text-lg">
              {result.correct ? `+${result.points} 分` : "再接再厲"}
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">解釋</h3>
            <p className="text-gray-700 leading-relaxed">{result.explanation}</p>
          </div>

          <div className="text-center">
            <button
              onClick={handleNext}
              className="bg-[hsl(var(--primary-500))] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[hsl(var(--primary-600))] transition-colors"
            >
              {questionIndex >= totalQuestions - 1 ? "完成測驗" : "下一題"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[hsl(var(--primary-500))] px-4 pt-6 pb-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onEnd} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">題目 {questionIndex + 1}/{totalQuestions}</span>
              <span className="text-sm">目前分數: {score}</span>
            </div>
            <div className="bg-white/20 rounded-full h-2">
              <div 
                className="bg-[hsl(var(--accent-500))] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 leading-relaxed">
            {question.question}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === index
                    ? "border-[hsl(var(--primary-500))] bg-[hsl(var(--primary-50))] text-[hsl(var(--primary-700))]"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
                      ? "border-[hsl(var(--primary-500))] bg-[hsl(var(--primary-500))]"
                      : "border-gray-300"
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null || isSubmitting}
            className={`font-semibold py-3 px-8 rounded-lg transition-colors ${
              selectedAnswer !== null && !isSubmitting
                ? "bg-[hsl(var(--primary-500))] text-white hover:bg-[hsl(var(--primary-600))]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "提交中..." : "提交答案"}
          </button>
        </div>
      </div>
    </div>
  );
}
