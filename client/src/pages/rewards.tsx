import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coins, Leaf, X, Check } from "lucide-react";
import { userKeys } from "@/lib/queryKeys";
import type { User } from "@shared/schema";

// Hardcoded rewards data as requested
const rewardsData = [
  {
    id: 1,
    partnerName: "星巴克",
    title: "中杯咖啡券",
    cost: 100,
    image: "https://placehold.co/200x150/4CAF50/white?text=Starbucks"
  },
  {
    id: 2,
    partnerName: "麥當勞",
    title: "大麥克套餐券",
    cost: 150,
    image: "https://placehold.co/200x150/FFC107/white?text=McDonald's"
  },
  {
    id: 3,
    partnerName: "7-ELEVEN",
    title: "City Cafe 拿鐵",
    cost: 80,
    image: "https://placehold.co/200x150/FF9800/white?text=7-ELEVEN"
  },
  {
    id: 4,
    partnerName: "誠品書店",
    title: "環保書籍折價券",
    cost: 120,
    image: "https://placehold.co/200x150/9C27B0/white?text=誠品"
  },
  {
    id: 5,
    partnerName: "康是美",
    title: "環保日用品券",
    cost: 90,
    image: "https://placehold.co/200x150/2196F3/white?text=康是美"
  },
  {
    id: 6,
    partnerName: "家樂福",
    title: "有機食品折價券",
    cost: 200,
    image: "https://placehold.co/200x150/4CAF50/white?text=家樂福"
  }
];

export default function Rewards() {
  const [selectedReward, setSelectedReward] = useState<typeof rewardsData[0] | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { data: user } = useQuery<User>({
    queryKey: userKeys.current(),
  });

  const handleRewardClick = (reward: typeof rewardsData[0]) => {
    setSelectedReward(reward);
    setShowConfirmation(true);
  };

  const handleConfirmRedeem = () => {
    setShowConfirmation(false);
    setShowSuccess(true);
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedReward(null);
    }, 3000);
  };

  const handleCancelRedeem = () => {
    setShowConfirmation(false);
    setSelectedReward(null);
  };

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

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[hsl(var(--accent-500))] to-[hsl(var(--primary-500))] px-4 pt-6 pb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">綠色獎勵</h1>
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <Leaf className="w-4 h-4" />
            <span className="font-semibold">{user.totalPoints || 150}</span>
          </div>
        </div>
        <p className="text-[hsl(var(--primary-100))] text-sm">
          用您的綠葉兌換環保夥伴的精選獎勵
        </p>
      </div>

      {/* Rewards Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rewardsData.map((reward) => {
            const userPoints = user.totalPoints || 150;
            const canAfford = userPoints >= reward.cost;
            
            return (
              <div
                key={reward.id}
                onClick={() => canAfford && handleRewardClick(reward)}
                className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${
                  canAfford 
                    ? "hover:shadow-md hover:scale-[1.02] cursor-pointer" 
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Reward Image */}
                <div className="h-32 bg-gray-100 relative overflow-hidden">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-full object-cover"
                  />
                  {!canAfford && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-sm font-medium">積分不足</span>
                    </div>
                  )}
                </div>

                {/* Reward Info */}
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">
                      {reward.title}
                    </h3>
                    <p className="text-sm text-gray-600">{reward.partnerName}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Leaf className="w-4 h-4 text-green-600" />
                      <span className={`font-semibold ${canAfford ? "text-green-600" : "text-gray-500"}`}>
                        {reward.cost}
                      </span>
                    </div>
                    <div className={`text-sm px-3 py-1 rounded-full ${
                      canAfford 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {canAfford ? "可兌換" : "積分不足"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && selectedReward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="bg-[hsl(var(--primary-100))] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-[hsl(var(--primary-600))]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">確認兌換</h3>
              <p className="text-gray-600">
                確定要用 <span className="font-semibold text-green-600">{selectedReward.cost} 綠葉</span> 兌換{" "}
                <span className="font-semibold">{selectedReward.title}</span> 嗎？
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCancelRedeem}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 py-3 px-4 bg-[hsl(var(--primary-500))] text-white rounded-lg font-medium hover:bg-[hsl(var(--primary-600))] transition-colors"
              >
                確認兌換
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Dialog */}
      {showSuccess && selectedReward && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">兌換成功！</h3>
              <p className="text-gray-600 mb-4">
                請向 <span className="font-semibold text-[hsl(var(--primary-600))]">{selectedReward.partnerName}</span> 店員出示此畫面
              </p>
              
              {/* QR Code Placeholder */}
              <div className="bg-gray-100 rounded-lg p-8 mb-4">
                <div className="w-32 h-32 bg-black/10 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-gray-500 text-xs">兌換碼</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-500">
                此兌換券將在 3 秒後自動關閉
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
