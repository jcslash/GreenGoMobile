import { useQuery } from "@tanstack/react-query";
import { User as UserIcon, LogOut, Leaf, Brain, Award, Droplets } from "lucide-react";
import { userKeys } from "@/lib/queryKeys";
import type { User } from "@shared/schema";

export default function Profile() {
  const { data: user } = useQuery<User>({
    queryKey: userKeys.current(),
  });

  // Hardcoded statistics as requested for MVP
  const statistics = {
    totalCarbon: "12.5 kg",
    accumulatedLeaves: "150",
    completedQuizzes: "42",
    unlockedBadges: "3"
  };

  // Mock badge icons for display
  const badges = [
    { icon: Leaf, color: "bg-green-100 text-green-600" },
    { icon: Brain, color: "bg-blue-100 text-blue-600" },
    { icon: Award, color: "bg-amber-100 text-amber-600" },
  ];

  const handleLogout = () => {
    alert("登出功能尚未實現 (MVP階段)");
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
      {/* Header with User Avatar */}
      <div className="bg-[hsl(var(--primary-500))] px-4 pt-6 pb-8 text-white">
        <div className="text-center">
          {/* User Avatar */}
          <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-10 h-10 text-[hsl(var(--primary-500))]" />
          </div>
          <h1 className="text-xl font-bold mb-1">{user.displayName || "環保使用者"}</h1>
          <p className="text-[hsl(var(--primary-100))] text-sm">
            環保實踐者 • 等級 {user.level || 1}
          </p>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Statistics List */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">我的統計數據</h3>
          
          <div className="space-y-4">
            {/* Total Carbon Reduction */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <span className="font-medium text-gray-900">總減碳量</span>
              </div>
              <span className="text-lg font-bold text-green-600">{statistics.totalCarbon}</span>
            </div>

            {/* Accumulated Green Leaves */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="font-medium text-gray-900">累積綠葉</span>
              </div>
              <span className="text-lg font-bold text-emerald-600">{statistics.accumulatedLeaves}</span>
            </div>

            {/* Completed Quizzes */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">已完成問答</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{statistics.completedQuizzes}</span>
            </div>

            {/* Unlocked Badges */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <span className="font-medium text-gray-900">已解鎖徽章</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-amber-600">{statistics.unlockedBadges}</span>
                {/* Display badge icons */}
                <div className="flex gap-1 ml-2">
                  {badges.map((badge, index) => {
                    const IconComponent = badge.icon;
                    return (
                      <div key={index} className={`rounded-full w-6 h-6 flex items-center justify-center ${badge.color}`}>
                        <IconComponent className="w-3 h-3" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact Summary */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-4 text-center">環保貢獻總覽</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{statistics.totalCarbon}</div>
              <div className="text-sm text-gray-600">累積減碳量</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Droplets className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">1,250L</div>
              <div className="text-sm text-gray-600">節省水資源</div>
            </div>
          </div>
        </div>

        {/* Logout Button at Bottom */}
        <div className="pt-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            <span>登出</span>
          </button>
        </div>

        {/* App Version */}
        <div className="text-center pt-4 pb-8">
          <p className="text-sm text-gray-500">綠捷 GreenGo v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">為地球永續發展而努力</p>
        </div>
      </div>
    </div>
  );
}
