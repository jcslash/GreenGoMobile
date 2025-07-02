import React, { createContext, useContext, useState, ReactNode } from 'react';

interface QuizContextType {
  shouldStartDailyChallenge: boolean;
  setShouldStartDailyChallenge: (value: boolean) => void;
  dailyChallengeCategoryId: number;
  setDailyChallengeCategoryId: (id: number) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [shouldStartDailyChallenge, setShouldStartDailyChallenge] = useState(false);
  const [dailyChallengeCategoryId, setDailyChallengeCategoryId] = useState(1); // 預設為水資源保護

  return (
    <QuizContext.Provider
      value={{
        shouldStartDailyChallenge,
        setShouldStartDailyChallenge,
        dailyChallengeCategoryId,
        setDailyChallengeCategoryId,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
}