import { 
  users, 
  quizCategories, 
  quizQuestions, 
  userProgress, 
  userAchievements, 
  rewards, 
  userRewards, 
  dailyTips,
  type User, 
  type InsertUser, 
  type QuizCategory, 
  type QuizQuestion, 
  type UserProgress, 
  type UserAchievement, 
  type Reward, 
  type UserReward, 
  type DailyTip 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User>;
  updateUserLevel(userId: number, level: number, experience: number): Promise<User>;
  
  // Quiz methods
  getQuizCategories(): Promise<QuizCategory[]>;
  getQuizQuestions(categoryId: number): Promise<QuizQuestion[]>;
  getRandomQuestions(categoryId: number, limit: number): Promise<QuizQuestion[]>;
  
  // Progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getUserProgressByCategory(userId: number, categoryId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, categoryId: number, correct: boolean): Promise<UserProgress>;
  
  // Achievement methods
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  unlockAchievement(userId: number, achievementId: string): Promise<UserAchievement>;
  
  // Reward methods
  getRewards(): Promise<Reward[]>;
  getUserRewards(userId: number): Promise<UserReward[]>;
  redeemReward(userId: number, rewardId: number): Promise<UserReward>;
  
  // Daily tip methods
  getTodaysTip(): Promise<DailyTip | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizCategories: Map<number, QuizCategory>;
  private quizQuestions: Map<number, QuizQuestion>;
  private userProgress: Map<string, UserProgress>;
  private userAchievements: Map<number, UserAchievement>;
  private rewards: Map<number, Reward>;
  private userRewards: Map<number, UserReward>;
  private dailyTips: Map<number, DailyTip>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.quizCategories = new Map();
    this.quizQuestions = new Map();
    this.userProgress = new Map();
    this.userAchievements = new Map();
    this.rewards = new Map();
    this.userRewards = new Map();
    this.dailyTips = new Map();
    this.currentId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize quiz categories
    const categories: Omit<QuizCategory, 'id'>[] = [
      {
        name: "水資源保護",
        description: "學習水資源保護相關知識",
        icon: "droplets",
        color: "blue",
        difficulty: "beginner",
        isLocked: false,
        requiredLevel: 1,
      },
      {
        name: "再生能源",
        description: "了解再生能源的重要性",
        icon: "sun",
        color: "yellow",
        difficulty: "intermediate",
        isLocked: false,
        requiredLevel: 2,
      },
      {
        name: "循環經濟",
        description: "探索循環經濟概念",
        icon: "recycle",
        color: "green",
        difficulty: "advanced",
        isLocked: true,
        requiredLevel: 5,
      },
    ];

    categories.forEach((category) => {
      const id = this.currentId++;
      this.quizCategories.set(id, { ...category, id });
    });

    // Initialize quiz questions
    const questions: Omit<QuizQuestion, 'id'>[] = [
      {
        categoryId: 1,
        question: "每天平均一個人需要多少公升的水？",
        options: ["20公升", "50公升", "100公升", "200公升"],
        correctAnswer: 2,
        explanation: "聯合國建議每人每天至少需要20-50公升水用於飲用、烹飪和個人衛生，但現代生活實際需求約100公升。",
        points: 10,
      },
      {
        categoryId: 1,
        question: "以下哪個是最有效的節水方法？",
        options: ["縮短淋浴時間", "修理漏水龍頭", "使用節水器具", "以上皆是"],
        correctAnswer: 3,
        explanation: "所有這些方法都能有效節水，結合使用效果最佳。",
        points: 10,
      },
      {
        categoryId: 2,
        question: "太陽能板的使用壽命大約是多少年？",
        options: ["10年", "15年", "25年", "50年"],
        correctAnswer: 2,
        explanation: "現代太陽能板的使用壽命通常為25-30年，是非常耐用的再生能源設備。",
        points: 15,
      },
    ];

    questions.forEach((question) => {
      const id = this.currentId++;
      this.quizQuestions.set(id, { ...question, id });
    });

    // Initialize rewards
    const rewardsList: Omit<Reward, 'id'>[] = [
      {
        name: "星巴克咖啡券",
        description: "中杯飲品任選一杯",
        icon: "coffee",
        pointsCost: 800,
        isAvailable: true,
      },
      {
        name: "環保購物袋",
        description: "100%有機棉材質",
        icon: "shopping-bag",
        pointsCost: 600,
        isAvailable: true,
      },
      {
        name: "捷運一日票",
        description: "台北捷運全線通用",
        icon: "ticket",
        pointsCost: 1500,
        isAvailable: true,
      },
    ];

    rewardsList.forEach((reward) => {
      const id = this.currentId++;
      this.rewards.set(id, { ...reward, id });
    });

    // Initialize daily tip
    const tip: Omit<DailyTip, 'id'> = {
      title: "今日永續小知識",
      content: "使用大眾運輸可以減少約60%的碳排放量。每次搭捷運，你都在為環保盡一份力！",
      icon: "lightbulb",
      date: new Date(),
    };
    this.dailyTips.set(1, { ...tip, id: 1 });

    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "default_user",
      displayName: "小綠",
      level: 5,
      totalPoints: 1250,
      experience: 750,
      createdAt: new Date(),
    };
    this.users.set(1, defaultUser);

    // Initialize user progress
    const progressData: Omit<UserProgress, 'id'>[] = [
      {
        userId: 1,
        categoryId: 1,
        completedQuestions: 15,
        totalQuestions: 15,
        correctAnswers: 15,
        lastCompletedAt: new Date(),
      },
      {
        userId: 1,
        categoryId: 2,
        completedQuestions: 12,
        totalQuestions: 20,
        correctAnswers: 10,
        lastCompletedAt: new Date(),
      },
    ];

    progressData.forEach((progress) => {
      const id = this.currentId++;
      const key = `${progress.userId}-${progress.categoryId}`;
      this.userProgress.set(key, { ...progress, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      level: 1,
      totalPoints: 0,
      experience: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, totalPoints: user.totalPoints + points };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserLevel(userId: number, level: number, experience: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, level, experience };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getQuizCategories(): Promise<QuizCategory[]> {
    return Array.from(this.quizCategories.values());
  }

  async getQuizQuestions(categoryId: number): Promise<QuizQuestion[]> {
    return Array.from(this.quizQuestions.values()).filter(q => q.categoryId === categoryId);
  }

  async getRandomQuestions(categoryId: number, limit: number): Promise<QuizQuestion[]> {
    const questions = await this.getQuizQuestions(categoryId);
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(p => p.userId === userId);
  }

  async getUserProgressByCategory(userId: number, categoryId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-${categoryId}`;
    return this.userProgress.get(key);
  }

  async updateUserProgress(userId: number, categoryId: number, correct: boolean): Promise<UserProgress> {
    const key = `${userId}-${categoryId}`;
    let progress = this.userProgress.get(key);
    
    if (!progress) {
      const id = this.currentId++;
      progress = {
        id,
        userId,
        categoryId,
        completedQuestions: 0,
        totalQuestions: 20, // Default total
        correctAnswers: 0,
        lastCompletedAt: null,
      };
    }
    
    const updatedProgress = {
      ...progress,
      completedQuestions: progress.completedQuestions + 1,
      correctAnswers: correct ? progress.correctAnswers + 1 : progress.correctAnswers,
      lastCompletedAt: new Date(),
    };
    
    this.userProgress.set(key, updatedProgress);
    return updatedProgress;
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values()).filter(a => a.userId === userId);
  }

  async unlockAchievement(userId: number, achievementId: string): Promise<UserAchievement> {
    const id = this.currentId++;
    const achievement: UserAchievement = {
      id,
      userId,
      achievementId,
      unlockedAt: new Date(),
    };
    this.userAchievements.set(id, achievement);
    return achievement;
  }

  async getRewards(): Promise<Reward[]> {
    return Array.from(this.rewards.values()).filter(r => r.isAvailable);
  }

  async getUserRewards(userId: number): Promise<UserReward[]> {
    return Array.from(this.userRewards.values()).filter(r => r.userId === userId);
  }

  async redeemReward(userId: number, rewardId: number): Promise<UserReward> {
    const user = this.users.get(userId);
    const reward = this.rewards.get(rewardId);
    
    if (!user) throw new Error("User not found");
    if (!reward) throw new Error("Reward not found");
    if (user.totalPoints < reward.pointsCost) throw new Error("Insufficient points");
    
    // Deduct points
    await this.updateUserPoints(userId, -reward.pointsCost);
    
    // Add user reward
    const id = this.currentId++;
    const userReward: UserReward = {
      id,
      userId,
      rewardId,
      redeemedAt: new Date(),
      isUsed: false,
    };
    this.userRewards.set(id, userReward);
    return userReward;
  }

  async getTodaysTip(): Promise<DailyTip | undefined> {
    return this.dailyTips.get(1); // For simplicity, return the default tip
  }
}

export const storage = new MemStorage();
