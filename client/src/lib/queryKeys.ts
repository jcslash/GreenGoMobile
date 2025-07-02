// 集中管理所有 API 查詢鍵，確保型別安全和一致性

export const userKeys = {
  all: () => ['/api/user'] as const,
  current: () => ['/api/user/current'] as const,
  byId: (id: number) => ['/api/user', id] as const,
} as const;

export const quizKeys = {
  all: () => ['/api/quiz'] as const,
  categories: () => ['/api/quiz/categories'] as const,
  questions: (categoryId: number) => [`/api/quiz/questions/${categoryId}`] as const,
  questionsWithLimit: (categoryId: number, limit: number) => 
    [`/api/quiz/questions/${categoryId}`, { limit }] as const,
} as const;

export const progressKeys = {
  all: () => ['/api/progress'] as const,
  current: () => ['/api/progress/current'] as const,
  byUser: (userId: number) => ['/api/progress', userId] as const,
  byCategory: (userId: number, categoryId: number) => 
    ['/api/progress', userId, categoryId] as const,
} as const;

export const achievementKeys = {
  all: () => ['/api/achievements'] as const,
  byUser: (userId: number) => ['/api/achievements', userId] as const,
} as const;

export const rewardKeys = {
  all: () => ['/api/rewards'] as const,
  userRewards: (userId: number) => ['/api/rewards/user', userId] as const,
} as const;

export const dailyTipKeys = {
  current: () => ['/api/daily-tip'] as const,
} as const;