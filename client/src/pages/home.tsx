import { useQuery } from "@tanstack/react-query";
import { Leaf, Lightbulb, Brain, Trophy, Check, Award } from "lucide-react";
import { Link } from "wouter";
import type { User, DailyTip } from "@shared/schema";

export default function Home() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: dailyTip } = useQuery<DailyTip>({
    queryKey: ["/api/daily-tip"],
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary-500))] mx-auto mb-4"></div>
          <p className="text-gray-500">載入中...</p>
        </div>
      </div>
    );
  }

  const weeklyProgress = 75; // Mock weekly progress
  const completedDays = 5;
  const totalDays = 7;

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-[hsl(var(--primary-500))] px-4 pt-6 pb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">哈囉，{user.displayName}！</h1>
            <p className="text-[hsl(var(--primary-100))] text-sm">今天也要為地球努力喔 🌱</p>
          </div>
          <div className="bg-[hsl(var(--primary-600))] rounded-full p-3">
            <Leaf className="w-6 h-6" />
          </div>
        </div>
        
        {/* Progress Card */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">本週學習進度</span>
            <span className="text-xs bg-[hsl(var(--accent-500))] text-white px-2 py-1 rounded-full">
              {weeklyProgress}%
            </span>
          </div>
          <div className="bg-white/20 rounded-full h-2 mb-2">
            <div 
              className="bg-[hsl(var(--accent-500))] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
          <p className="text-xs text-[hsl(var(--primary-100))]">
            {completedDays}/{totalDays} 天完成每日任務
          </p>
        </div>
      </div>

      {/* Content Cards */}
      <div className="px-4 py-6 space-y-6">
        {/* Today's Tip */}
        {dailyTip && (
          <div className="bg-gradient-to-r from-[hsl(var(--secondary-50))] to-[hsl(var(--primary-50))] rounded-xl p-4 border border-[hsl(var(--primary-100))]">
            <div className="flex items-start gap-3">
              <div className="bg-[hsl(var(--primary-500))] rounded-full p-2 flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{dailyTip.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {dailyTip.content}
                </p>
                <button className="text-[hsl(var(--primary-600))] text-sm font-medium mt-2">
                  了解更多 →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/quiz">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-[hsl(var(--primary-100))] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-[hsl(var(--primary-600))]" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">每日測驗</h4>
              <p className="text-xs text-gray-500 mt-1">3題待完成</p>
            </div>
          </Link>
          
          <Link href="/rewards">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="bg-[hsl(var(--accent-100))] rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-[hsl(var(--accent-600))]" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">成就挑戰</h4>
              <p className="text-xs text-gray-500 mt-1">2個新徽章</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">最近活動</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">完成「碳足跡」測驗</p>
                <p className="text-xs text-gray-500">獲得 50 點綠色積分</p>
              </div>
              <span className="text-xs text-gray-400">2小時前</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 rounded-full p-2">
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">解鎖「通勤環保達人」徽章</p>
                <p className="text-xs text-gray-500">連續7天搭乘大眾運輸</p>
              </div>
              <span className="text-xs text-gray-400">昨天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
