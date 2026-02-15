
// components/Tooltip.tsx
import React, { ReactNode, useState, useRef, useEffect, CSSProperties } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  delay?: number; // Delay in ms before tooltip appears
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, delay = 300 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  let showTimeout: number; // Changed NodeJS.Timeout to number
  let hideTimeout: number; // Changed NodeJS.Timeout to number

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    showTimeout = setTimeout(() => {
      setIsHovered(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(showTimeout);
    hideTimeout = setTimeout(() => {
      setIsHovered(false);
    }, 100); // Small delay to prevent flickering
  };

  useEffect(() => {
    if (isHovered) {
      setShowTooltip(true);
      if (containerRef.current && tooltipRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        // Calculate position
        let newLeft = rect.left + rect.width / 2 - tooltipRect.width / 2;
        let newTop = rect.top - tooltipRect.height - 8; // 8px above the element

        // Adjust if it goes off-screen horizontally
        if (newLeft < 0) {
          newLeft = 0;
        } else if (newLeft + tooltipRect.width > window.innerWidth) {
          newLeft = window.innerWidth - tooltipRect.width;
        }

        // Adjust if it goes off-screen vertically (show below instead)
        if (newTop < 0) {
          newTop = rect.bottom + 8;
        }

        setPosition({ top: newTop + window.scrollY, left: newLeft + window.scrollX });
      }
    } else {
      setShowTooltip(false);
    }
  }, [isHovered]);

  useEffect(() => {
    return () => {
      clearTimeout(showTimeout);
      clearTimeout(hideTimeout);
    };
  }, []);

  const tooltipStyles: CSSProperties = {
    top: position.top,
    left: position.left,
  };

  return (
    <div ref={containerRef} className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div
          ref={tooltipRef}
          style={tooltipStyles}
          className="fixed z-50 bg-gray-700 bg-opacity-90 backdrop-blur-sm text-gray-200 text-xs rounded-md p-2 shadow-lg border border-gray-600 animate-fade-in whitespace-nowrap pointer-events-none"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
