interface SustainableIslandProps {
  level: number;
}

export function SustainableIsland({ level }: SustainableIslandProps) {
  return (
    <div className="flex justify-center">
      <svg width="280" height="200" viewBox="0 0 280 200" className="drop-shadow-lg">
        {/* Sky gradient background */}
        <defs>
          <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#E0F6FF" />
          </linearGradient>
          <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A90E2" />
            <stop offset="100%" stopColor="#2E5F8F" />
          </linearGradient>
          <linearGradient id="islandGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#8FBC8F" />
            <stop offset="100%" stopColor="#6B8E23" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="280" height="120" fill="url(#skyGradient)" />
        
        {/* Ocean */}
        <rect x="0" y="120" width="280" height="80" fill="url(#oceanGradient)" />
        
        {/* Ocean waves */}
        <path 
          d="M0,130 Q20,125 40,130 T80,130 T120,130 T160,130 T200,130 T240,130 T280,130" 
          stroke="#5BA3F5" 
          strokeWidth="2" 
          fill="none" 
          opacity="0.7"
        />
        <path 
          d="M0,140 Q15,135 30,140 T60,140 T90,140 T120,140 T150,140 T180,140 T210,140 T240,140 T280,140" 
          stroke="#7DB8F7" 
          strokeWidth="1.5" 
          fill="none" 
          opacity="0.5"
        />

        {/* Main island */}
        <ellipse cx="140" cy="155" rx="90" ry="35" fill="url(#islandGradient)" />
        
        {/* Island beach */}
        <ellipse cx="140" cy="150" rx="85" ry="30" fill="#F4E4BC" />

        {/* Level 1-4: Basic island with small sapling */}
        {level >= 1 && (
          <>
            {/* Small sapling */}
            <line x1="120" y1="150" x2="120" y2="135" stroke="#8B4513" strokeWidth="2" />
            <circle cx="120" cy="132" r="6" fill="#90EE90" opacity="0.8" />
            <circle cx="117" cy="130" r="4" fill="#90EE90" opacity="0.6" />
            <circle cx="123" cy="129" r="5" fill="#90EE90" opacity="0.7" />
          </>
        )}

        {/* Level 5-9: Sapling grows to small tree, add bushes */}
        {level >= 5 && (
          <>
            {/* Remove sapling and add small tree */}
            <line x1="120" y1="150" x2="120" y2="120" stroke="#8B4513" strokeWidth="4" />
            <circle cx="120" cy="115" r="12" fill="#228B22" />
            <circle cx="115" cy="110" r="10" fill="#32CD32" opacity="0.8" />
            <circle cx="125" cy="112" r="9" fill="#32CD32" opacity="0.7" />
            
            {/* Small bushes */}
            <ellipse cx="160" cy="145" rx="8" ry="6" fill="#90EE90" />
            <ellipse cx="100" cy="148" rx="6" ry="5" fill="#90EE90" />
          </>
        )}

        {/* Level 10-14: Bigger tree, second tree, wind turbine */}
        {level >= 10 && (
          <>
            {/* Make first tree bigger */}
            <line x1="120" y1="150" x2="120" y2="105" stroke="#8B4513" strokeWidth="5" />
            <circle cx="120" cy="100" r="18" fill="#228B22" />
            <circle cx="112" cy="95" r="14" fill="#32CD32" opacity="0.8" />
            <circle cx="128" cy="98" r="12" fill="#32CD32" opacity="0.7" />
            <circle cx="120" cy="110" r="10" fill="#32CD32" opacity="0.6" />
            
            {/* Second tree */}
            <line x1="160" y1="150" x2="160" y2="125" stroke="#8B4513" strokeWidth="4" />
            <circle cx="160" cy="120" r="14" fill="#228B22" />
            <circle cx="155" cy="115" r="11" fill="#32CD32" opacity="0.8" />
            <circle cx="165" cy="118" r="9" fill="#32CD32" opacity="0.7" />
            
            {/* Wind turbine in background */}
            <line x1="220" y1="90" x2="220" y2="40" stroke="#D3D3D3" strokeWidth="2" />
            <circle cx="220" cy="38" r="2" fill="#D3D3D3" />
            {/* Turbine blades */}
            <line x1="220" y1="38" x2="210" y2="28" stroke="#E6E6E6" strokeWidth="1.5" />
            <line x1="220" y1="38" x2="230" y2="48" stroke="#E6E6E6" strokeWidth="1.5" />
            <line x1="220" y1="38" x2="225" y2="25" stroke="#E6E6E6" strokeWidth="1.5" />
          </>
        )}

        {/* Level 15+: Multiple trees, wind turbines, solar panels */}
        {level >= 15 && (
          <>
            {/* Third tree */}
            <line x1="180" y1="150" x2="180" y2="130" stroke="#8B4513" strokeWidth="3" />
            <circle cx="180" cy="125" r="10" fill="#228B22" />
            <circle cx="176" cy="122" r="8" fill="#32CD32" opacity="0.8" />
            <circle cx="184" cy="128" r="7" fill="#32CD32" opacity="0.7" />
            
            {/* Additional bushes */}
            <ellipse cx="140" cy="147" rx="7" ry="5" fill="#90EE90" />
            <ellipse cx="200" cy="149" rx="9" ry="6" fill="#90EE90" />
            
            {/* Second wind turbine */}
            <line x1="60" y1="85" x2="60" y2="35" stroke="#D3D3D3" strokeWidth="2" />
            <circle cx="60" cy="33" r="2" fill="#D3D3D3" />
            <line x1="60" y1="33" x2="50" y2="23" stroke="#E6E6E6" strokeWidth="1.5" />
            <line x1="60" y1="33" x2="70" y2="43" stroke="#E6E6E6" strokeWidth="1.5" />
            <line x1="60" y1="33" x2="65" y2="20" stroke="#E6E6E6" strokeWidth="1.5" />
            
            {/* Solar panels */}
            <rect x="85" y="145" width="20" height="8" fill="#1E3A5F" rx="1" />
            <rect x="87" y="147" width="16" height="4" fill="#2E5A8F" />
            
            <rect x="190" y="143" width="15" height="6" fill="#1E3A5F" rx="1" />
            <rect x="192" y="144" width="11" height="4" fill="#2E5A8F" />
            
            {/* More vegetation details */}
            <circle cx="105" cy="148" r="3" fill="#90EE90" opacity="0.6" />
            <circle cx="195" cy="147" r="4" fill="#90EE90" opacity="0.7" />
            <circle cx="155" cy="149" r="2" fill="#90EE90" opacity="0.5" />
          </>
        )}

        {/* Sun (always present) */}
        <circle cx="250" cy="30" r="15" fill="#FFD700" opacity="0.9" />
        <circle cx="250" cy="30" r="12" fill="#FFA500" opacity="0.7" />
        
        {/* Sun rays */}
        <line x1="250" y1="10" x2="250" y2="5" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
        <line x1="265" y1="15" x2="268" y2="12" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
        <line x1="270" y1="30" x2="275" y2="30" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
        <line x1="265" y1="45" x2="268" y2="48" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
        <line x1="235" y1="45" x2="232" y2="48" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
        <line x1="230" y1="30" x2="225" y2="30" stroke="#FFD700" strokeWidth="2" opacity="0.6" />
        <line x1="235" y1="15" x2="232" y2="12" stroke="#FFD700" strokeWidth="2" opacity="0.6" />

        {/* Clouds (level-dependent quantity) */}
        {level >= 5 && (
          <g opacity="0.7">
            <circle cx="50" cy="40" r="8" fill="white" />
            <circle cx="58" cy="40" r="10" fill="white" />
            <circle cx="65" cy="40" r="7" fill="white" />
          </g>
        )}
        
        {level >= 10 && (
          <g opacity="0.6">
            <circle cx="180" cy="25" r="6" fill="white" />
            <circle cx="186" cy="25" r="8" fill="white" />
            <circle cx="192" cy="25" r="5" fill="white" />
          </g>
        )}
      </svg>
    </div>
  );
}