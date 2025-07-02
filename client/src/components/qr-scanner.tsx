import { useState } from "react";
import { Camera } from "lucide-react";

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

export function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const handleDemoScan = () => {
    // 示範掃描功能
    const mockQRData = `ECO_CHECKIN_DEMO_${Date.now()}`;
    onScan(mockQRData);
  };

  return (
    <div className="flex-1 relative bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Simulated camera viewfinder */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Camera viewfinder frame */}
          <div className="w-64 h-64 border-4 border-green-400 rounded-2xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
            
            {/* Scanning line animation */}
            <div className="absolute inset-2 overflow-hidden">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            </div>
            
            {/* QR code simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-8 gap-1 w-32 h-32 opacity-30">
                {Array.from({ length: 64 }, (_, i) => (
                  <div 
                    key={i} 
                    className={`w-full h-full ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-12 left-4 right-4 text-center">
        <div className="bg-black/70 backdrop-blur rounded-xl p-6 text-white">
          <Camera className="w-8 h-8 mx-auto mb-3 text-green-400" />
          <h3 className="text-lg font-semibold mb-2">QR Code 掃描器</h3>
          <p className="text-sm text-gray-300 mb-4">
            將 QR Code 對準取景框內
          </p>
          <button 
            onClick={handleDemoScan}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <span>示範掃描</span>
          </button>
          <p className="text-xs text-gray-400 mt-2">
            點擊按鈕進行模擬掃描
          </p>
        </div>
      </div>
    </div>
  );
}