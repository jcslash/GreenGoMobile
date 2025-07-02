import { Home, Lightbulb, Gift, User } from "lucide-react";
import { useLocation } from "wouter";
import { Link } from "wouter";

const navItems = [
  { path: "/", icon: Home, label: "首頁" },
  { path: "/quiz", icon: Lightbulb, label: "永續問答" },
  { path: "/rewards", icon: Gift, label: "綠色獎勵" },
  { path: "/profile", icon: User, label: "個人" },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 z-40">
      <div className="flex">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path} className="flex-1">
              <div className={`w-full py-3 px-2 text-center transition-all duration-200 ${
                isActive 
                  ? "text-[hsl(var(--primary-500))]" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
                <Icon className="w-6 h-6 mx-auto mb-1" />
                <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>{label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
