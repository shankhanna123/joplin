import React from 'react';
import Svg, { Line, Circle } from 'react-native-svg';
import { BackgroundSettings, BackgroundType } from './InkingTypes';

interface CanvasBackgroundProps {
  settings: BackgroundSettings;
  width: number;
  height: number;
}

export const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  settings,
  width,
  height
}) => {
  if (settings.type === BackgroundType.NONE) {
    return null;
  }

  const renderRuledBackground = () => {
    const lines = [];
    const lineCount = Math.ceil(height / settings.lineSpacing);
    
    for (let i = 0; i <= lineCount; i++) {
      const y = i * settings.lineSpacing;
      lines.push(
        <Line
          key={`ruled-${i}`}
          x1="0"
          y1={y}
          x2={width}
          y2={y}
          stroke={settings.lineColor}
          strokeWidth={settings.lineWidth}
        />
      );
    }
    
    return lines;
  };

  const renderGridBackground = () => {
    const elements = [];
    const verticalLines = Math.ceil(width / settings.lineSpacing);
    const horizontalLines = Math.ceil(height / settings.lineSpacing);
    
    // Vertical lines
    for (let i = 0; i <= verticalLines; i++) {
      const x = i * settings.lineSpacing;
      elements.push(
        <Line
          key={`grid-v-${i}`}
          x1={x}
          y1="0"
          x2={x}
          y2={height}
          stroke={settings.lineColor}
          strokeWidth={settings.lineWidth}
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i <= horizontalLines; i++) {
      const y = i * settings.lineSpacing;
      elements.push(
        <Line
          key={`grid-h-${i}`}
          x1="0"
          y1={y}
          x2={width}
          y2={y}
          stroke={settings.lineColor}
          strokeWidth={settings.lineWidth}
        />
      );
    }
    
    return elements;
  };

  const renderDotGridBackground = () => {
    const dots = [];
    const dotsX = Math.ceil(width / settings.lineSpacing);
    const dotsY = Math.ceil(height / settings.lineSpacing);
    
    for (let i = 0; i <= dotsX; i++) {
      for (let j = 0; j <= dotsY; j++) {
        const x = i * settings.lineSpacing;
        const y = j * settings.lineSpacing;
        dots.push(
          <Circle
            key={`dot-${i}-${j}`}
            cx={x}
            cy={y}
            r={settings.lineWidth}
            fill={settings.lineColor}
          />
        );
      }
    }
    
    return dots;
  };

  const renderBackground = () => {
    switch (settings.type) {
      case BackgroundType.RULED:
        return renderRuledBackground();
      case BackgroundType.GRID:
        return renderGridBackground();
      case BackgroundType.DOT_GRID:
        return renderDotGridBackground();
      default:
        return null;
    }
  };

  return (
    <Svg
      style={{ position: 'absolute', top: 0, left: 0 }}
      width={width}
      height={height}
    >
      {renderBackground()}
    </Svg>
  );
};