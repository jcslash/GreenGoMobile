import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Leaf, QrCode, X, TreePine, Sparkles } from "lucide-react";
import { QRCodeScanner } from "@/components/qr-scanner";
import { SuccessToast } from "@/components/success-toast";
import { SustainableIsland } from "@/components/sustainable-island";
import { userKeys, dailyTipKeys } from "@/lib/queryKeys";
import type { User, DailyTip } from "@shared/schema";

export default function Home() {
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: userKeys.current(),
  });

  const { data: dailyTip } = useQuery<DailyTip>({
    queryKey: dailyTipKeys.current(),
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

  const handleQRCodeScan = (data: string) => {
    console.log("QR Code scanned:", data);
    setIsScanning(false);
    setShowSuccess(true);
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return "深夜好";
    if (hour < 12) return "早安";
    if (hour < 18) return "午安";
    return "晚安";
  };

  return (
    <>
      <div className="fade-in min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
        {/* Welcome Header */}
        <div className="bg-[hsl(var(--primary-500))] px-4 pt-6 pb-6 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">
              {getCurrentGreeting()}，永續旅人！
            </h1>
            <p className="text-[hsl(var(--primary-100))] text-sm">
              今天也要為地球盡一份心力 🌱
            </p>
          </div>
        </div>

        {/* Sustainable Island */}
        <div className="px-4 py-8">
          <div className="bg-gradient-to-br from-emerald-100 via-green-50 to-blue-100 rounded-3xl p-8 shadow-lg border border-green-200 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-2 right-2 opacity-20">
              <Sparkles className="w-8 h-8 text-green-600" />
            </div>
            <div className="absolute bottom-2 left-2 opacity-10">
              <TreePine className="w-12 h-12 text-green-700" />
            </div>
            
            <div className="text-center relative z-10">
              {/* Dynamic Sustainable Island */}
              <div className="mb-6">
                <SustainableIsland level={user.level} />
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                你的永續島嶼
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                透過環保行動讓小島更加繁茂
              </p>
              
              {/* Green Leaf Points */}
              <div className="bg-white/60 backdrop-blur rounded-2xl py-3 px-6 inline-flex items-center gap-2 shadow-sm">
                <Leaf className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-gray-800">
                  {user.totalPoints || 150}
                </span>
                <span className="text-sm text-gray-600">綠葉</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tip */}
        {dailyTip && (
          <div className="px-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-2 text-center">
                💡 {dailyTip.title}
              </h3>
              <p className="text-base text-gray-700 text-center leading-relaxed">
                {dailyTip.content}
              </p>
            </div>
          </div>
        )}

        {/* QR Code Scan Button */}
        <div className="px-4 pb-8">
          <button
            onClick={() => setIsScanning(true)}
            className="w-full bg-gradient-to-r from-[hsl(var(--primary-500))] to-[hsl(var(--secondary-500))] 
                     text-white font-bold py-6 px-6 rounded-2xl shadow-lg 
                     hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200
                     flex items-center justify-center gap-3"
          >
            <QrCode className="w-7 h-7" />
            <div className="text-center">
              <div className="text-xl font-semibold">掃描 QR Code</div>
              <div className="text-base opacity-90">完成綠色打卡</div>
            </div>
          </button>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">掃描 QR Code</h2>
            <button
              onClick={() => setIsScanning(false)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Scanner */}
          <div className="flex-1 relative">
            <QRCodeScanner onScan={handleQRCodeScan} />
            
            {/* Scanning frame overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 border-4 border-white rounded-2xl opacity-80">
                  {/* Corner decorations */}
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-[hsl(var(--accent-500))] rounded-tl-lg"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-[hsl(var(--accent-500))] rounded-tr-lg"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-[hsl(var(--accent-500))] rounded-bl-lg"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-[hsl(var(--accent-500))] rounded-br-lg"></div>
                </div>
                <p className="text-white text-center mt-4 text-sm">
                  將 QR Code 對準框內進行掃描
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      <SuccessToast 
        show={showSuccess} 
        onClose={() => setShowSuccess(false)} 
      />
    </>
  );
}
