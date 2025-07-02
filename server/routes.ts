import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizAnswerSchema, insertRedeemRewardSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get current user (default user for demo)
  app.get("/api/user/current", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Default user
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current user" });
    }
  });

  // Quiz routes
  app.get("/api/quiz/categories", async (req, res) => {
    try {
      const categories = await storage.getQuizCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz categories" });
    }
  });

  app.get("/api/quiz/questions/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      const limit = parseInt(req.query.limit as string) || 5;
      const questions = await storage.getRandomQuestions(categoryId, limit);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quiz questions" });
    }
  });

  app.post("/api/quiz/answer", async (req, res) => {
    try {
      const userId = 1; // Default user
      const { questionId, selectedAnswer } = insertQuizAnswerSchema.parse(req.body);
      
      // Get question to check answer and determine category
      const allQuestions = await storage.getQuizQuestions(1); // This is a limitation of our simple storage
      const question = allQuestions.find(q => q.id === questionId) || 
                      (await storage.getQuizQuestions(2)).find(q => q.id === questionId) ||
                      (await storage.getQuizQuestions(3)).find(q => q.id === questionId);
      
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      // Update user progress
      const progress = await storage.updateUserProgress(userId, question.categoryId, isCorrect);
      
      // Award points if correct
      if (isCorrect) {
        await storage.updateUserPoints(userId, question.points);
      }
      
      res.json({
        correct: isCorrect,
        explanation: question.explanation,
        points: isCorrect ? question.points : 0,
        progress,
      });
    } catch (error) {
      res.status(400).json({ message: "Failed to submit answer" });
    }
  });

  // Progress routes
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  app.get("/api/progress/current", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(1); // Default user
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get current user progress" });
    }
  });

  // Achievement routes
  app.get("/api/achievements/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user achievements" });
    }
  });

  // Reward routes
  app.get("/api/rewards", async (req, res) => {
    try {
      const rewards = await storage.getRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get rewards" });
    }
  });

  app.get("/api/rewards/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const userRewards = await storage.getUserRewards(userId);
      res.json(userRewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user rewards" });
    }
  });

  app.post("/api/rewards/redeem", async (req, res) => {
    try {
      const userId = 1; // Default user
      const { rewardId } = insertRedeemRewardSchema.parse(req.body);
      const userReward = await storage.redeemReward(userId, rewardId);
      res.json(userReward);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Failed to redeem reward" });
    }
  });

  // Daily tip route
  app.get("/api/daily-tip", async (req, res) => {
    try {
      const tip = await storage.getTodaysTip();
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: "Failed to get daily tip" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
