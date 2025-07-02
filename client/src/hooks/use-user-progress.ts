import { useQuery } from "@tanstack/react-query";
import type { UserProgress } from "@shared/schema";

export function useUserProgress(userId?: number) {
  const { data: progress = [], ...rest } = useQuery<UserProgress[]>({
    queryKey: userId ? ["/api/progress", userId] : ["/api/progress/current"],
  });

  const getProgressByCategory = (categoryId: number) => {
    return progress.find(p => p.categoryId === categoryId);
  };

  const getTotalCompletedQuestions = () => {
    return progress.reduce((total, p) => total + p.completedQuestions, 0);
  };

  const getTotalCorrectAnswers = () => {
    return progress.reduce((total, p) => total + p.correctAnswers, 0);
  };

  const getOverallAccuracy = () => {
    const totalCompleted = getTotalCompletedQuestions();
    const totalCorrect = getTotalCorrectAnswers();
    return totalCompleted > 0 ? Math.round((totalCorrect / totalCompleted) * 100) : 0;
  };

  return {
    progress,
    getProgressByCategory,
    getTotalCompletedQuestions,
    getTotalCorrectAnswers,
    getOverallAccuracy,
    ...rest,
  };
}
