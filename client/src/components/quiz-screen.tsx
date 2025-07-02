import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, Leaf, ArrowRight } from "lucide-react";
import { userKeys } from "@/lib/queryKeys";
import type { User } from "@shared/schema";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "以下何者是「快時尚」對環境造成的主要衝擊？",
    options: ["增加水源污染", "減少碳排放", "促進生物多樣性"],
    correctAnswer: "增加水源污染",
    explanation: "製造一件棉質T恤需消耗近3000公升的水，且染整過程中的化學物質常污染水源。"
  },
  {
    id: 2,
    question: "哪一種交通方式的碳排放量最低？",
    options: ["開車", "搭乘捷運", "騎機車", "搭計程車"],
    correctAnswer: "搭乘捷運",
    explanation: "大眾運輸系統平均每人每公里的碳排放量比私人車輛低60-80%。"
  },
  {
    id: 3,
    question: "什麼是「循環經濟」的核心概念？",
    options: ["大量生產", "減少、重複使用、回收", "增加消費"],
    correctAnswer: "減少、重複使用、回收",
    explanation: "循環經濟強調3R原則：Reduce（減少）、Reuse（重複使用）、Recycle（回收），讓資源能夠循環利用。"
  },
  {
    id: 4,
    question: "LED燈泡比傳統白熾燈泡可節省多少能源？",
    options: ["約30%", "約50%", "約80%", "約95%"],
    correctAnswer: "約80%",
    explanation: "LED燈泡比傳統白熾燈泡節能約80%，且壽命長達25倍以上。"
  },
  {
    id: 5,
    question: "哪一種飲食習慣最有助於減少碳足跡？",
    options: ["多吃紅肉", "增加蔬食比例", "只吃進口食品", "大量飲用瓶裝水"],
    correctAnswer: "增加蔬食比例",
    explanation: "畜牧業產生的溫室氣體占全球總量約14.5%，減少肉類攝取能有效降低個人碳足跡。"
  },
  {
    id: 6,
    question: "什麼是「綠建築」最重要的特徵？",
    options: ["外觀必須是綠色", "節能減碳與環保材料", "建築成本最低", "建造速度最快"],
    correctAnswer: "節能減碳與環保材料",
    explanation: "綠建築注重能源效率、水資源管理、使用環保材料，以及減少對環境的負面影響。"
  }
];

export function QuizScreen() {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>(
    quizQuestions[Math.floor(Math.random() * quizQuestions.length)]
  );
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // 使用集中式查詢獲取使用者資料，確保與其他頁面同步
  const { data: user } = useQuery<User>({
    queryKey: userKeys.current(),
  });

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    // Reset state
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowExplanation(false);
    
    // Load random question (exclude current one)
    const remainingQuestions = quizQuestions.filter(q => q.id !== currentQuestion.id);
    if (remainingQuestions.length > 0) {
      const randomQuestion = remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)];
      setCurrentQuestion(randomQuestion);
    } else {
      // If we've used all questions, reset and pick randomly
      const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
      setCurrentQuestion(randomQuestion);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="bg-[hsl(var(--primary-500))] rounded-xl p-4 text-white mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">永續知識問答</h1>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Leaf className="w-4 h-4" />
            <span className="font-semibold">{user?.totalPoints || 0}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
          {currentQuestion.question}
        </h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.correctAnswer;
            
            let buttonStyle = "w-full p-4 text-left rounded-xl border-2 transition-all font-medium ";
            
            if (!isAnswered) {
              buttonStyle += "border-gray-200 bg-white hover:border-[hsl(var(--primary-500))] hover:bg-[hsl(var(--primary-50))] cursor-pointer";
            } else {
              if (isCorrectOption) {
                buttonStyle += "border-green-500 bg-green-50 text-green-800";
              } else if (isSelected && !isCorrectOption) {
                buttonStyle += "border-red-500 bg-red-50 text-red-800";
              } else {
                buttonStyle += "border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed";
              }
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={buttonStyle}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isAnswered && isCorrectOption 
                      ? "border-green-500 bg-green-500" 
                      : isAnswered && isSelected && !isCorrectOption
                      ? "border-red-500 bg-red-500"
                      : "border-gray-300"
                  }`}>
                    {isAnswered && isCorrectOption && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-base">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Success Message */}
        {isAnswered && isCorrect && (
          <div className="bg-green-100 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">答對了！獲得 20 綠葉！</span>
            </div>
          </div>
        )}

        {/* Wrong Answer Message */}
        {isAnswered && !isCorrect && (
          <div className="bg-amber-100 border border-amber-200 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 text-amber-800">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">再接再厲！正確答案是：{currentQuestion.correctAnswer}</span>
            </div>
          </div>
        )}

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">💡 小知識</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next Question Button */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-[hsl(var(--primary-500))] text-white font-bold py-4 px-6 rounded-xl hover:bg-[hsl(var(--primary-600))] transition-colors flex items-center justify-center gap-2"
          >
            <span>下一題</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Progress Info */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          持續答題累積更多綠葉，解鎖更多環保獎勵！
        </p>
      </div>
    </div>
  );
}