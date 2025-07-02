import { useQuery, useMutation } from "@tanstack/react-query";
import { Coins, Coffee, ShoppingBag, Ticket, Leaf, Train, Brain, Trophy, Users, Star, Plus, Award } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User, Reward, UserReward } from "@shared/schema";

const getRewardIcon = (icon: string) => {
  switch (icon) {
    case "coffee": return Coffee;
    case "shopping-bag": return ShoppingBag;
    case "ticket": return Ticket;
    default: return Coffee;
  }
};

const getAchievementIcon = (icon: string) => {
  switch (icon) {
    case "leaf": return Leaf;
    case "train": return Train;
    case "brain": return Brain;
    case "trophy": return Trophy;
    case "users": return Users;
    case "star": return Star;
    default: return Leaf;
  }
};

export default function Rewards() {
  const { toast } = useToast();
  
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: rewards = [] } = useQuery<Reward[]>({
    queryKey: ["/api/rewards"],
  });

  const { data: userRewards = [] } = useQuery<UserReward[]>({
    queryKey: ["/api/rewards/user/1"],
  });

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: number) => {
      const response = await apiRequest("POST", "/api/rewards/redeem", { rewardId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rewards/user/1"] });
      toast({
        title: "兌換成功！",
        description: "獎勵已加入您的帳戶",
      });
    },
    onError: (error: any) => {
      toast({
        title: "兌換失敗",
        description: error.message || "積分不足或系統錯誤",
        variant: "destructive",
      });
    },
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

  const levelProgress = 750;
  const levelMax = 1000;
  const progressPercentage = (levelProgress / levelMax) * 100;

  // Mock achievements data
  const achievements = [
    { id: "eco-newbie", name: "環保新手", icon: "leaf", unlocked: true, color: "green" },
    { id: "commuter-pro", name: "通勤達人", icon: "train", unlocked: true, color: "blue" },
    { id: "knowledge-king", name: "知識王", icon: "brain", unlocked: true, color: "amber" },
    { id: "eco-master", name: "環保大師", icon: "trophy", unlocked: false, color: "gray" },
    { id: "community-leader", name: "社群領袖", icon: "users", unlocked: false, color: "gray" },
    { id: "perfectionist", name: "完美主義", icon: "star", unlocked: false, color: "gray" },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--accent-500))] to-[hsl(var(--primary-500))] px-4 pt-6 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">綠色獎勵</h1>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Coins className="w-4 h-4" />
            <span className="font-semibold">{user.totalPoints}</span>
          </div>
        </div>
        
        {/* Level Progress */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">等級 {user.level} - 環保實踐者</span>
            <span className="text-sm">{levelProgress}/{levelMax} XP</span>
          </div>
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-[hsl(var(--accent-500))] h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Available Rewards */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">可兌換獎勵</h3>
          <div className="grid gap-4">
            {rewards.map((reward) => {
              const IconComponent = getRewardIcon(reward.icon);
              const canAfford = user.totalPoints >= reward.pointsCost;
              
              return (
                <div key={reward.id} className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 ${!canAfford ? "opacity-60" : ""}`}>
                  <div className="flex gap-4">
                    <div className={`rounded-lg w-16 h-16 flex items-center justify-center flex-shrink-0 ${
                      reward.icon === "coffee" ? "bg-amber-100" :
                      reward.icon === "shopping-bag" ? "bg-green-100" :
                      "bg-blue-100"
                    }`}>
                      <IconComponent className={`w-8 h-8 ${
                        reward.icon === "coffee" ? "text-amber-600" :
                        reward.icon === "shopping-bag" ? "text-green-600" :
                        "text-blue-600"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Coins className="w-4 h-4 text-[hsl(var(--accent-500))]" />
                          <span className={`font-medium ${canAfford ? "text-[hsl(var(--accent-600))]" : "text-gray-500"}`}>
                            {reward.pointsCost}點
                          </span>
                        </div>
                        <button 
                          onClick={() => redeemMutation.mutate(reward.id)}
                          disabled={!canAfford || redeemMutation.isPending}
                          className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                            canAfford 
                              ? "bg-[hsl(var(--primary-500))] text-white hover:bg-[hsl(var(--primary-600))]" 
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {redeemMutation.isPending ? "兌換中..." : canAfford ? "兌換" : "積分不足"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">成就徽章</h3>
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const IconComponent = getAchievementIcon(achievement.icon);
              const colorClass = achievement.unlocked
                ? achievement.color === "green" ? "bg-green-100 text-green-600" :
                  achievement.color === "blue" ? "bg-blue-100 text-blue-600" :
                  achievement.color === "amber" ? "bg-amber-100 text-amber-600" :
                  "bg-gray-100 text-gray-400"
                : "bg-gray-100 text-gray-400";
              
              return (
                <div key={achievement.id} className={`bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 ${!achievement.unlocked ? "opacity-60" : ""}`}>
                  <div className={`rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 ${colorClass}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-semibold text-gray-900">{achievement.name}</h4>
                  <p className={`text-xs mt-1 ${achievement.unlocked ? 
                    achievement.color === "green" ? "text-green-600" :
                    achievement.color === "blue" ? "text-blue-600" :
                    achievement.color === "amber" ? "text-amber-600" :
                    "text-gray-400"
                    : "text-gray-400"
                  }`}>
                    {achievement.unlocked ? "已解鎖" : "未解鎖"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Rewards */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">最近獲得</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full p-2">
                  <Plus className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">完成每日測驗</p>
                  <p className="text-xs text-gray-500">+50 綠色積分</p>
                </div>
                <span className="text-xs text-gray-400">2小時前</span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 rounded-full p-2">
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">解鎖新徽章</p>
                  <p className="text-xs text-gray-500">通勤環保達人</p>
                </div>
                <span className="text-xs text-gray-400">昨天</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
