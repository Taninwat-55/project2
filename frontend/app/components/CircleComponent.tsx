// components/circle-component.tsx
import React from 'react';

interface BlurryCircleProps {
  size?: string;
  className?: string; // Use this for top, left, right, bottom positioning
  color?: string;
  opacity?: string;
}

export const BlurryCircle: React.FC<BlurryCircleProps> = ({
  size = '600px',
  className = 'top-1/2 left-1/2', // Default center
  color = 'radial-gradient(circle, hsla(15, 100%, 50%, 1.00) 0%, rgba(255, 85, 0, 1) 35%, rgba(240,240,240,1) 70%)',
  opacity = '0.4'
}) => {
  return (
    <div 
      className={`fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        filter: 'blur(90px)',
        opacity: opacity,
        zIndex: 0, // Changed to 0 so it sits just above the black background but below text
      }}
    />
  );
};