import { useQuery } from "@tanstack/react-query";
import { User as UserIcon, Settings, Bell, HelpCircle, Info, Leaf, Droplets } from "lucide-react";
import type { User, UserProgress } from "@shared/schema";

export default function Profile() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user/current"],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress/current"],
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

  const completedDays = 23;
  const unlockedBadges = 8;

  // Mock environmental impact data
  const carbonReduced = 342; // kg
  const waterSaved = 1250; // L

  const menuItems = [
    { icon: Settings, label: "設定", href: "#" },
    { icon: Bell, label: "通知設定", href: "#" },
    { icon: HelpCircle, label: "幫助與支援", href: "#" },
    { icon: Info, label: "關於綠捷", href: "#" },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-[hsl(var(--primary-500))] px-4 pt-6 pb-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-[hsl(var(--primary-500))]" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.displayName}</h1>
            <p className="text-[hsl(var(--primary-100))]">環保實踐者 • 等級 {user.level}</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{user.totalPoints}</div>
            <div className="text-xs text-[hsl(var(--primary-100))]">綠色積分</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completedDays}</div>
            <div className="text-xs text-[hsl(var(--primary-100))]">完成天數</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{unlockedBadges}</div>
            <div className="text-xs text-[hsl(var(--primary-100))]">解鎖徽章</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">學習進度</h3>
          <div className="space-y-4">
            {userProgress.map((progress) => {
              const completionRate = Math.round((progress.completedQuestions / progress.totalQuestions) * 100);
              const categoryName = progress.categoryId === 1 ? "水資源保護" :
                                 progress.categoryId === 2 ? "再生能源" :
                                 "廢棄物管理";
              const colorClass = progress.categoryId === 1 ? "bg-blue-500" :
                               progress.categoryId === 2 ? "bg-yellow-500" :
                               "bg-green-500";
              
              return (
                <div key={progress.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">{categoryName}</span>
                    <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${colorClass}`}
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            {/* Mock additional progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">廢棄物管理</span>
                <span className="text-sm font-medium text-gray-900">25%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full w-1/4 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
          <h3 className="font-semibold text-gray-900 mb-4">我的環保影響</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{carbonReduced}kg</div>
              <div className="text-xs text-gray-600">減少碳排放</div>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-gray-900">{waterSaved}L</div>
              <div className="text-xs text-gray-600">節省用水</div>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100">
              <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-xl">
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* App Version */}
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">綠捷 GreenGo v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
