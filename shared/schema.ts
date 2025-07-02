import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  level: integer("level").notNull().default(1),
  totalPoints: integer("total_points").notNull().default(0),
  experience: integer("experience").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizCategories = pgTable("quiz_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  difficulty: text("difficulty").notNull(), // "beginner", "intermediate", "advanced"
  isLocked: boolean("is_locked").notNull().default(false),
  requiredLevel: integer("required_level").notNull().default(1),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull(),
  question: text("question").notNull(),
  options: json("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  points: integer("points").notNull().default(10),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  categoryId: integer("category_id").notNull(),
  completedQuestions: integer("completed_questions").notNull().default(0),
  totalQuestions: integer("total_questions").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  lastCompletedAt: timestamp("last_completed_at"),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const rewards = pgTable("rewards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  pointsCost: integer("points_cost").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
});

export const userRewards = pgTable("user_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  rewardId: integer("reward_id").notNull(),
  redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
  isUsed: boolean("is_used").notNull().default(false),
});

export const dailyTips = pgTable("daily_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  icon: text("icon").notNull(),
  date: timestamp("date").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  displayName: true,
});

export const insertQuizAnswerSchema = z.object({
  questionId: z.number(),
  selectedAnswer: z.number(),
});

export const insertRedeemRewardSchema = z.object({
  rewardId: z.number(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type QuizCategory = typeof quizCategories.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type UserReward = typeof userRewards.$inferSelect;
export type DailyTip = typeof dailyTips.$inferSelect;
export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type InsertRedeemReward = z.infer<typeof insertRedeemRewardSchema>;
