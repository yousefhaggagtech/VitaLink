"use client";

import React, { useState, useRef, useCallback } from "react";
import { ChartWrapperProps } from "@/domain/types/types";

const ChartWrapper: React.FC<ChartWrapperProps> = ({ title, children, theme }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const exportButtonRef = useRef<HTMLButtonElement>(null);

  const downloadChart = useCallback(async () => {
    if (!containerRef?.current || !exportButtonRef?.current) return;

    setIsDownloading(true);
    exportButtonRef.current.style.display = 'none';

    try {
      const html2canvas = (await import('html2canvas')).default;

      const actualWidth = containerRef.current.scrollWidth;
      const actualHeight = containerRef.current.scrollHeight;

      const bufferHeight = actualHeight + 100;
      const bufferWidth = actualWidth + 20;

      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';

      tempContainer.style.width = `${bufferWidth}px`;
      tempContainer.style.height = `${bufferHeight}px`;

      tempContainer.style.backgroundColor = theme.background.secondary;
      tempContainer.style.color = theme.text.primary;
      tempContainer.style.fontFamily = 'sans-serif';

      tempContainer.innerHTML = containerRef.current.innerHTML;
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        backgroundColor: theme.background.secondary,
        scale: 2,
        width: bufferWidth,
        height: bufferHeight,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error downloading chart:', error);
      alert('An error occurred while saving the chart. Please ensure all charts are visible.');
    } finally {
      if (exportButtonRef.current) {
        exportButtonRef.current.style.display = 'flex';
      }
      setIsDownloading(false);
    }
  }, [title, theme]);

  return (
    <div
      className="rounded-xl p-5 sm:p-6 border overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: `${theme.background.secondary}dd`,
        backdropFilter: 'blur(10px)',
        borderColor: theme.border.medium,
        boxShadow: theme.shadow.soft,
        animation: 'slide-in-fade 0.7s ease-out',
      }}
      ref={containerRef}
    >
      <div className="flex items-center justify-between mb-5 gap-3">
        <h2
          className="text-base sm:text-lg font-semibold tracking-wide"
          style={{ color: theme.text.primary, letterSpacing: '0.05em', textTransform: 'uppercase' }}
        >
          {title}
        </h2>
        <button
          onClick={downloadChart}
          disabled={isDownloading}
          ref={exportButtonRef}
          className="px-3 py-2 rounded-lg text-xs font-bold uppercase flex-shrink-0 transition-all duration-200 flex items-center gap-1.5"
          style={{
            backgroundColor: isDownloading ? theme.text.tertiary : theme.accent.primary,
            color: isDownloading ? theme.text.secondary : theme.background.primary,
            border: `1px solid ${theme.accent.primary}`,
            opacity: isDownloading ? 0.6 : 1,
            cursor: isDownloading ? 'not-allowed' : 'pointer',
            animation: 'bounce-in 0.6s ease-out',
          }}
        >
          <span>📊</span>
          <span>{isDownloading ? 'Saving...' : 'Export'}</span>
        </button>
      </div>
      <div className="overflow-hidden" style={{ overflowX: 'hidden', overflowY: 'hidden' }}>
        {children}
      </div>
    </div>
  );
};

export default ChartWrapper;
