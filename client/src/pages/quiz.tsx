import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Droplets, Sun, Recycle, Check, Lock } from "lucide-react";
import { QuizCard } from "@/components/quiz/quiz-card";
import { QuizQuestion } from "@/components/quiz/quiz-question";
import { useQuiz } from "@/hooks/use-quiz";
import { useQuizContext } from "@/contexts/QuizContext";
import type { User, QuizCategory, UserProgress } from "@shared/schema";

const getCategoryIcon = (icon: string) => {
  switch (icon) {
    case "droplets": return Droplets;
    case "sun": return Sun;
    case "recycle": return Recycle;
    default: return Droplets;
  }
};

const getCategoryColor = (color: string) => {
  switch (color) {
    case "blue": return "bg-blue-100 text-blue-600";
    case "yellow": return "bg-yellow-100 text-yellow-600";
    case "green": return "bg-green-100 text-green-600";
    default: return "bg-blue-100 text-blue-600";
  }
};

export default function Quiz() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: categories = [] } = useQuery<QuizCategory[]>({
    queryKey: ["/api/quiz/categories"],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress/current"],
  });

  const { 
    shouldStartDailyChallenge, 
    setShouldStartDailyChallenge, 
    dailyChallengeCategoryId 
  } = useQuizContext();

  const { 
    currentQuestion, 
    isQuizActive, 
    score, 
    questionIndex, 
    totalQuestions,
    startQuiz, 
    submitAnswer, 
    nextQuestion,
    endQuiz 
  } = useQuiz();

  // 處理每日挑戰的自動啟動
  useEffect(() => {
    if (shouldStartDailyChallenge && user && categories.length > 0) {
      // 自動開始每日挑戰測驗
      startQuiz(dailyChallengeCategoryId);
      // 重置狀態，避免重複觸發
      setShouldStartDailyChallenge(false);
    }
  }, [shouldStartDailyChallenge, user, categories, dailyChallengeCategoryId, startQuiz, setShouldStartDailyChallenge]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary-500))] mx-auto mb-4"></div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  if (isQuizActive && currentQuestion) {
    return (
      <QuizQuestion 
        question={currentQuestion}
        questionIndex={questionIndex}
        totalQuestions={totalQuestions}
        score={score}
        onAnswer={submitAnswer}
        onNext={nextQuestion}
        onEnd={endQuiz}
      />
    );
  }

  const dailyProgress = 7;
  const dailyTotal = 10;
  const progressPercentage = (dailyProgress / dailyTotal) * 100;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-[hsl(var(--primary-500))] px-4 pt-6 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">永續問答</h1>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[hsl(var(--accent-500))]" />
            <span className="font-semibold">{user.totalPoints}</span>
          </div>
        </div>
        
        {/* Progress */}
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>今日進度</span>
            <span>{dailyProgress}/{dailyTotal} 題</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-[hsl(var(--accent-500))] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quiz Categories */}
      <div className="px-4 py-6 space-y-4">
        {/* Current Quiz */}
        <div className="bg-gradient-to-r from-[hsl(var(--primary-500))] to-[hsl(var(--secondary-500))] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">每日挑戰</h3>
            <div className="bg-white/20 rounded-full px-3 py-1">
              <span className="text-sm font-medium">3/5</span>
            </div>
          </div>
          <p className="text-[hsl(var(--primary-100))] mb-4">
            完成今天的環保知識測驗，贏取額外積分！
          </p>
          <button 
            onClick={() => startQuiz(1)}
            className="bg-white text-[hsl(var(--primary-600))] font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
          >
            繼續答題
          </button>
        </div>

        {/* Quiz Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">測驗類別</h3>
          
          <div className="grid gap-3">
            {categories.map((category) => {
              const progress = userProgress.find(p => p.categoryId === category.id);
              const completionRate = progress 
                ? Math.round((progress.completedQuestions / progress.totalQuestions) * 100)
                : 0;
                
              const IconComponent = getCategoryIcon(category.icon);
              const colorClass = getCategoryColor(category.color);
              
              return (
                <QuizCard
                  key={category.id}
                  category={category}
                  progress={progress}
                  onStartQuiz={() => startQuiz(category.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">本週排行榜</h3>
            <button className="text-[hsl(var(--primary-600))] text-sm font-medium">
              查看全部
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold text-amber-600">1</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">環保小達人</span>
              </div>
              <span className="text-sm text-gray-600">2,450分</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gray-200 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-600">2</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-900">綠色生活家</span>
              </div>
              <span className="text-sm text-gray-600">2,320分</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center">
                <span className="text-xs font-bold text-orange-600">3</span>
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-[hsl(var(--primary-600))]">你</span>
              </div>
              <span className="text-sm text-[hsl(var(--primary-600))] font-medium">
                {user.totalPoints}分
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
