import { db } from "./db";
import { users, quizCategories, quizQuestions, rewards, dailyTips } from "@shared/schema";

async function seed() {
  console.log("Starting database seeding...");

  // Create default user
  const [user] = await db.insert(users).values({
    username: "default_user",
    displayName: "小綠",
    level: 5,
    totalPoints: 1250,
    experience: 750,
  }).returning();

  console.log("Created default user:", user.displayName);

  // Create quiz categories
  const categoriesData = [
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

  const categories = await db.insert(quizCategories).values(categoriesData).returning();
  console.log("Created quiz categories:", categories.length);

  // Create quiz questions
  const questionsData = [
    {
      categoryId: categories[0].id,
      question: "每天平均一個人需要多少公升的水？",
      options: ["20公升", "50公升", "100公升", "200公升"],
      correctAnswer: 2,
      explanation: "聯合國建議每人每天至少需要20-50公升水用於飲用、烹飪和個人衛生，但現代生活實際需求約100公升。",
      points: 10,
    },
    {
      categoryId: categories[0].id,
      question: "以下哪個是最有效的節水方法？",
      options: ["縮短淋浴時間", "修理漏水龍頭", "使用節水器具", "以上皆是"],
      correctAnswer: 3,
      explanation: "所有這些方法都能有效節水，結合使用效果最佳。",
      points: 10,
    },
    {
      categoryId: categories[1].id,
      question: "太陽能板的使用壽命大約是多少年？",
      options: ["10年", "15年", "25年", "50年"],
      correctAnswer: 2,
      explanation: "現代太陽能板的使用壽命通常為25-30年，是非常耐用的再生能源設備。",
      points: 15,
    },
  ];

  const questions = await db.insert(quizQuestions).values(questionsData).returning();
  console.log("Created quiz questions:", questions.length);

  // Create rewards
  const rewardsData = [
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

  const rewardsList = await db.insert(rewards).values(rewardsData).returning();
  console.log("Created rewards:", rewardsList.length);

  // Create daily tip
  const tipData = {
    title: "今日永續小知識",
    content: "使用大眾運輸可以減少約60%的碳排放量。每次搭捷運，你都在為環保盡一份力！",
    icon: "lightbulb",
    date: new Date(),
  };

  const [tip] = await db.insert(dailyTips).values(tipData).returning();
  console.log("Created daily tip:", tip.title);

  console.log("Database seeding completed successfully!");
}

seed().catch(console.error);