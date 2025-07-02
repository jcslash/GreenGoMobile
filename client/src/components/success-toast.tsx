import { CheckCircle, X, Leaf, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useQuizContext } from "@/contexts/QuizContext";

interface SuccessToastProps {
  show: boolean;
  onClose: () => void;
}

export function SuccessToast({ show, onClose }: SuccessToastProps) {
  const [, setLocation] = useLocation();
  const { setShouldStartDailyChallenge, setDailyChallengeCategoryId } = useQuizContext();

  const handleStartQuiz = () => {
    // 設定每日挑戰狀態
    setShouldStartDailyChallenge(true);
    setDailyChallengeCategoryId(1); // 水資源保護類別
    
    // 關閉 Modal
    onClose();
    
    // 導航到測驗頁面
    setLocation("/quiz");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-[slideUp_0.3s_ease-out] relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Success icon */}
        <div className="text-center mb-4">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            打卡成功！
          </h3>
        </div>

        {/* Success message */}
        <div className="text-center space-y-3">
          <p className="text-gray-700 leading-relaxed">
            感謝你為地球減少了 <strong className="text-green-600">200g</strong> 的碳排放！
          </p>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">+50 綠葉獲得</span>
            </div>
            <p className="text-sm text-green-700">
              快去回答問題，灌溉你的小樹苗吧！
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleStartQuiz}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            <span>開始永續問答</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-500 font-medium py-2 px-4 hover:text-gray-700 transition-colors text-sm border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}