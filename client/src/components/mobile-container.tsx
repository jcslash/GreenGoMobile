import { Signal, Wifi, Battery } from "lucide-react";

interface MobileContainerProps {
  children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="mobile-container">
      {/* Status Bar */}
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-[hsl(var(--primary-500))] h-8 flex items-center justify-between px-4 text-white text-sm font-medium z-50">
        <span>{getCurrentTime()}</span>
        <span className="font-bold">綠捷 GreenGo</span>
        <div className="flex items-center gap-1">
          <Signal className="w-4 h-4" />
          <Wifi className="w-4 h-4" />
          <Battery className="w-4 h-4" />
        </div>
      </div>
      
      {/* Main Content with top padding for status bar */}
      <div className="pt-8">
        {children}
      </div>
    </div>
  );
}
