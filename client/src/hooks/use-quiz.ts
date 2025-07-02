import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { quizKeys, userKeys, progressKeys } from "@/lib/queryKeys";
import type { QuizQuestion } from "@shared/schema";

export function useQuiz() {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const { data: quizQuestions = [] } = useQuery<QuizQuestion[]>({
    queryKey: currentCategoryId ? quizKeys.questions(currentCategoryId) : [],
    enabled: !!currentCategoryId && isQuizActive,
  });

  const answerMutation = useMutation({
    mutationFn: async ({ questionId, selectedAnswer }: { questionId: number; selectedAnswer: number }) => {
      const response = await apiRequest("POST", "/api/quiz/answer", {
        questionId,
        selectedAnswer,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.correct) {
        setScore(prev => prev + data.points);
      }
      // 失效使用者相關快取，確保點數更新在所有頁面同步
      queryClient.invalidateQueries({ queryKey: userKeys.current() });
      queryClient.invalidateQueries({ queryKey: userKeys.all() });
      
      // 失效進度相關快取
      queryClient.invalidateQueries({ queryKey: progressKeys.current() });
      queryClient.invalidateQueries({ queryKey: progressKeys.all() });
    },
  });

  const startQuiz = (categoryId: number) => {
    setCurrentCategoryId(categoryId);
    setIsQuizActive(true);
    setCurrentQuestionIndex(0);
    setScore(0);
  };

  const submitAnswer = async (selectedAnswer: number) => {
    if (!currentQuestion) return;
    
    const result = await answerMutation.mutateAsync({
      questionId: currentQuestion.id,
      selectedAnswer,
    });

    return result;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    setIsQuizActive(false);
    setCurrentCategoryId(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestions([]);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex] || null;

  return {
    isQuizActive,
    currentQuestion,
    questionIndex: currentQuestionIndex,
    totalQuestions: quizQuestions.length,
    score,
    startQuiz,
    submitAnswer,
    nextQuestion,
    endQuiz,
    isSubmitting: answerMutation.isPending,
  };
}
