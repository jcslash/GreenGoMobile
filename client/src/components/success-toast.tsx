import { useEffect } from "react";
import { CheckCircle, X, Leaf } from "lucide-react";

interface SuccessToastProps {
  show: boolean;
  onClose: () => void;
}

export function SuccessToast({ show, onClose }: SuccessToastProps) {
  useEffect(() => {
    if (show) {
      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

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
        <div className="mt-6 space-y-2">
          <button
            onClick={onClose}
            className="w-full bg-[hsl(var(--primary-500))] text-white font-semibold py-3 px-4 rounded-xl hover:bg-[hsl(var(--primary-600))] transition-colors"
          >
            太棒了！
          </button>
          <button
            onClick={onClose}
            className="w-full text-gray-600 font-medium py-2 px-4 hover:text-gray-800 transition-colors text-sm"
          >
            稍後再說
          </button>
        </div>
      </div>
    </div>
  );
}