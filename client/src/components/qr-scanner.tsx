import { useEffect, useRef, useState } from "react";
import { Camera, AlertCircle } from "lucide-react";
import jsQR from "jsqr";

interface QRCodeScannerProps {
  onScan: (data: string) => void;
}

export function QRCodeScanner({ onScan }: QRCodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment", // Use back camera if available
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsLoading(false);
          
          // Start scanning for QR codes
          startScanning();
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("無法存取相機。請確認已授權相機權限。");
        setIsLoading(false);
      }
    };

    const startScanning = () => {
      scanIntervalRef.current = setInterval(() => {
        if (videoRef.current && canvasRef.current) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");

          if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Real QR code detection using jsQR
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
              onScan(code.data);
            }
          }
        }
      }, 100);
    };



    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [onScan]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-white">
        <div className="text-center p-6">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2">相機存取失敗</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[hsl(var(--primary-500))] text-white px-4 py-2 rounded-lg hover:bg-[hsl(var(--primary-600))] transition-colors"
          >
            重新嘗試
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <p className="text-lg">啟動相機中...</p>
          <p className="text-sm text-gray-300 mt-2">請允許相機存取權限</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="hidden"
      />
      
      {/* Scanning instructions */}
      <div className="absolute bottom-8 left-4 right-4 text-center">
        <div className="bg-black/50 backdrop-blur rounded-lg p-4 text-white">
          <p className="text-sm">
            將 QR Code 對準取景框內
          </p>
          <p className="text-xs text-gray-300 mt-1">
            輕觸畫面任意位置進行示範掃描
          </p>
        </div>
      </div>

      {/* Demo tap area for simulation */}
      <div 
        className="absolute inset-0 z-10"
        onClick={() => {
          // For demo purposes, allow manual trigger
          const mockQRData = `ECO_CHECKIN_DEMO_${Date.now()}`;
          onScan(mockQRData);
        }}
      />
    </div>
  );
}