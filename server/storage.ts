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
import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

// Legacy MemStorage class removed - now using DatabaseStorage

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User> {
    const currentUser = await this.getUser(userId);
    if (!currentUser) throw new Error("User not found");
    
    const newTotal = currentUser.totalPoints + points;
    const [user] = await db
      .update(users)
      .set({ totalPoints: newTotal })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUserLevel(userId: number, level: number, experience: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ level, experience })
      .where(eq(users.id, userId))
      .returning();
    
    if (!user) throw new Error("User not found");
    return user;
  }

  async getQuizCategories(): Promise<QuizCategory[]> {
    return await db.select().from(quizCategories);
  }

  async getQuizQuestions(categoryId: number): Promise<QuizQuestion[]> {
    return await db.select().from(quizQuestions).where(eq(quizQuestions.categoryId, categoryId));
  }

  async getRandomQuestions(categoryId: number, limit: number): Promise<QuizQuestion[]> {
    const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.categoryId, categoryId));
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, limit);
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    try {
      const result = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
      return result || [];
    } catch (error) {
      console.error("Error in getUserProgress:", error);
      return [];
    }
  }

  async getUserProgressByCategory(userId: number, categoryId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.categoryId, categoryId)));
    return progress || undefined;
  }

  async updateUserProgress(userId: number, categoryId: number, correct: boolean): Promise<UserProgress> {
    const existing = await this.getUserProgressByCategory(userId, categoryId);
    
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({
          completedQuestions: existing.completedQuestions + 1,
          correctAnswers: correct ? existing.correctAnswers + 1 : existing.correctAnswers,
          lastCompletedAt: new Date(),
        })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.categoryId, categoryId)))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values({
          userId,
          categoryId,
          completedQuestions: 1,
          totalQuestions: 20,
          correctAnswers: correct ? 1 : 0,
          lastCompletedAt: new Date(),
        })
        .returning();
      return newProgress;
    }
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: number, achievementId: string): Promise<UserAchievement> {
    const [achievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        unlockedAt: new Date(),
      })
      .returning();
    return achievement;
  }

  async getRewards(): Promise<Reward[]> {
    return await db.select().from(rewards).where(eq(rewards.isAvailable, true));
  }

  async getUserRewards(userId: number): Promise<UserReward[]> {
    return await db.select().from(userRewards).where(eq(userRewards.userId, userId));
  }

  async redeemReward(userId: number, rewardId: number): Promise<UserReward> {
    const user = await this.getUser(userId);
    const [reward] = await db.select().from(rewards).where(eq(rewards.id, rewardId));
    
    if (!user) throw new Error("User not found");
    if (!reward) throw new Error("Reward not found");
    if (user.totalPoints < reward.pointsCost) throw new Error("Insufficient points");
    
    // Deduct points
    await db
      .update(users)
      .set({ totalPoints: user.totalPoints - reward.pointsCost })
      .where(eq(users.id, userId));
    
    // Add user reward
    const [userReward] = await db
      .insert(userRewards)
      .values({
        userId,
        rewardId,
        redeemedAt: new Date(),
        isUsed: false,
      })
      .returning();
    return userReward;
  }

  async getTodaysTip(): Promise<DailyTip | undefined> {
    const tips = await db.select().from(dailyTips).limit(1);
    return tips[0] || undefined;
  }
}

export const storage = new DatabaseStorage();
