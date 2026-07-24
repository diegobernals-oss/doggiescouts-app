import React, { useMemo } from 'react';
import { PawPrint, Dog, Sun, Cloud, Heart, Sparkles, Smile } from 'lucide-react';

export const BoneIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 10c.7-1.3 1.8-2 3-2 2.2 0 4 1.8 4 4s-1.8 4-4 4c-1.2 0-2.3-.7-3-2H7c-.7 1.3-1.8 2-3 2-2.2 0-4-1.8-4-4s1.8-4 4-4c1.2 0 2.3.7 3 2h10Z" />
  </svg>
);

export const WatermarkBackground: React.FC = () => {
  const items = useMemo(() => {
    // Icons for a Happy Day at Campus
    const icons = [PawPrint, Dog, BoneIcon, Sun, Cloud, Heart, Sparkles, Smile];
    
    // Palette extracted directly from the physical card
    const colors = [
      'text-[#8A58DC]', // Lavender Poodle block
      'text-[#8FB328]', // Lime Schnauzer block
      'text-[#FF7B54]', // Coral Frenchie block
      'text-[#00A8E8]', // Aqua Blue Campus block
      'text-[#E8639A]', // Pink Pug block
    ];

    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      Icon: icons[i % icons.length],
      colorClass: colors[i % colors.length],
      top: `${(i * 13 + 3) % 94}%`,
      left: `${(i * 19 + 7) % 94}%`,
      rotate: (i * 43) % 360,
      size: 24 + (i % 4) * 8,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-12 select-none">
      
      {/* Soft Ambient Sunny Gradient Bulbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8FB328]/15 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-[30rem] h-[30rem] bg-[#00A8E8]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-[28rem] h-[28rem] bg-[#8A58DC]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#FF7B54]/15 rounded-full blur-3xl translate-y-1/3"></div>

      {/* Floating Happy Day Icons Pattern */}
      {items.map((item) => (
        <div
          key={item.id}
          className={`absolute ${item.colorClass} transition-transform duration-1000`}
          style={{
            top: item.top,
            left: item.left,
            transform: `rotate(${item.rotate}deg)`,
          }}
        >
          <item.Icon size={item.size} />
        </div>
      ))}
    </div>
  );
};
