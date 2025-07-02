import { Check, Lock } from "lucide-react";
import { Droplets, Sun, Recycle } from "lucide-react";
import type { QuizCategory, UserProgress } from "@shared/schema";

interface QuizCardProps {
  category: QuizCategory;
  progress?: UserProgress;
  onStartQuiz: () => void;
}

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
    case "blue": return "bg-blue-100";
    case "yellow": return "bg-yellow-100";
    case "green": return "bg-green-100";
    default: return "bg-blue-100";
  }
};

const getCategoryIconColor = (color: string) => {
  switch (color) {
    case "blue": return "text-blue-600";
    case "yellow": return "text-yellow-600";
    case "green": return "text-green-600";
    default: return "text-blue-600";
  }
};

export function QuizCard({ category, progress, onStartQuiz }: QuizCardProps) {
  const IconComponent = getCategoryIcon(category.icon);
  const colorClass = getCategoryColor(category.color);
  const iconColorClass = getCategoryIconColor(category.color);
  
  const completionRate = progress 
    ? Math.round((progress.completedQuestions / progress.totalQuestions) * 100)
    : 0;
  
  const isCompleted = completionRate === 100;
  const questionCount = progress?.totalQuestions || 15;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${colorClass} rounded-lg p-3`}>
            <IconComponent className={`w-6 h-6 ${iconColorClass}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{category.name}</h4>
            <p className="text-sm text-gray-500">
              {questionCount}題 • {category.difficulty === "beginner" ? "初級" : 
                              category.difficulty === "intermediate" ? "中級" : "高級"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {category.isLocked ? (
            <>
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">鎖定</span>
            </>
          ) : isCompleted ? (
            <>
              <div className="bg-green-100 rounded-full p-1">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">{completionRate}%</span>
            </>
          ) : progress ? (
            <>
              <div className="bg-[hsl(var(--primary-500))] rounded-full h-2 w-8">
                <div 
                  className="bg-[hsl(var(--accent-500))] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{completionRate}%</span>
            </>
          ) : (
            <button
              onClick={onStartQuiz}
              className="text-sm font-medium text-[hsl(var(--primary-600))] hover:text-[hsl(var(--primary-700))]"
            >
              開始
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
