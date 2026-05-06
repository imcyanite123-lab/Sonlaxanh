import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export default function Logo({ className = "", size = 40, showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Background Pin Shape */}
        <path 
          d="M50 95C50 95 85 65 85 40C85 20.67 69.33 5 50 5C30.67 5 15 20.67 15 40C15 65 50 95 50 95Z" 
          fill="#81D4FA" 
          stroke="#1B4332" 
          strokeWidth="4"
        />
        
        {/* Phone Icon inside */}
        <rect x="42" y="25" width="16" height="24" rx="3" fill="white" stroke="#1B4332" strokeWidth="3" />
        <line x1="48" y1="42" x2="52" y2="42" stroke="#1B4332" strokeWidth="2" strokeLinecap="round" />
        
        {/* Leaf Overlay */}
        <path 
          d="M18 45C18 45 25 35 45 40C45 40 50 65 35 80C35 80 18 85 18 45Z" 
          fill="#66BB6A" 
          stroke="#1B4332" 
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path 
          d="M20 48L40 70" 
          stroke="#1B4332" 
          strokeWidth="3" 
          strokeLinecap="round"
        />
      </svg>
      {showText && (
        <div className="flex font-display font-black italic tracking-tighter text-2xl leading-none">
          <span className="text-[#1B4332]">Sơn La</span>
          <span className="text-[#66BB6A] ml-1.5">Xanh</span>
        </div>
      )}
    </div>
  );
}
