import React, { useRef, useCallback, useState, useEffect, MouseEvent } from 'react';
import styled from 'styled-components';

interface Point {
  x: number;
  y: number;
}

interface InkStroke {
  id: string;
  path: string;
  color: string;
  width: number;
  timestamp: number;
  boundingBox?: BoundingBox;
}

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

enum DrawingMode {
  TEXT = 'text',
  INK = 'ink',
  INK_TEXT = 'ink-text',
  LINE = 'line',
  SHAPE = 'shape'
}

enum BackgroundType {
  NONE = 'none',
  RULED = 'ruled',
  GRID = 'grid',
  DOT_GRID = 'dot-grid'
}

interface InkingCanvasProps {
  onStrokeAdded: (stroke: InkStroke) => void;
  onStrokeUpdated: (stroke: InkStroke) => void;
  onStrokeDeleted: (strokeId: string) => void;
  strokes: InkStroke[];
  brushColor: string;
  brushWidth: number;
  isEnabled: boolean;
  mode: DrawingMode;
  backgroundType: BackgroundType;
  autoStraighten: boolean;
  width?: number;
  height?: number;
}

const CanvasContainer = styled.div<{ width?: number; height?: number }>`
  position: relative;
  width: ${props => props.width ? `${props.width}px` : '100%'};
  height: ${props => props.height ? `${props.height}px` : '400px'};
  border: 1px solid #e0e0e0;
  background: white;
  cursor: crosshair;
  overflow: hidden;
`;

const SvgCanvas = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const BackgroundPattern = styled.pattern``;

export const InkingCanvas: React.FC<InkingCanvasProps> = ({
  onStrokeAdded,
  onStrokeUpdated,
  onStrokeDeleted,
  strokes,
  brushColor,
  brushWidth,
  isEnabled,
  mode,
  backgroundType,
  autoStraighten,
  width = 800,
  height = 600
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [selectedStrokeId, setSelectedStrokeId] = useState<string | null>(null);

  const startDrawing = useCallback((event: MouseEvent) => {
    if (!isEnabled || mode === DrawingMode.TEXT) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const point: Point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    setIsDrawing(true);
    setCurrentPoints([point]);
    setCurrentPath(`M${point.x},${point.y}`);
  }, [isEnabled, mode]);

  const continueDrawing = useCallback((event: MouseEvent) => {
    if (!isDrawing) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const point: Point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    if (mode === DrawingMode.LINE) {
      // For line mode, only keep start and current point
      const startPoint = currentPoints[0];
      setCurrentPoints([startPoint, point]);
      setCurrentPath(`M${startPoint.x},${startPoint.y} L${point.x},${point.y}`);
    } else {
      const newPoints = [...currentPoints, point];
      setCurrentPoints(newPoints);
      setCurrentPath(prev => prev + ` L${point.x},${point.y}`);
    }
  }, [isDrawing, currentPoints, mode]);

  const finishDrawing = useCallback(() => {
    if (!isDrawing || currentPoints.length === 0) {
      setIsDrawing(false);
      setCurrentPath('');
      setCurrentPoints([]);
      return;
    }

    let finalPoints = [...currentPoints];
    let finalPath = currentPath;

    // Apply auto-straightening if enabled and stroke is approximately a line
    if (autoStraighten && isApproximateLine(finalPoints)) {
      finalPoints = [finalPoints[0], finalPoints[finalPoints.length - 1]];
      finalPath = `M${finalPoints[0].x},${finalPoints[0].y} L${finalPoints[1].x},${finalPoints[1].y}`;
    }

    const boundingBox = calculateBoundingBox(finalPoints);
    const newStroke: InkStroke = {
      id: Date.now().toString(),
      path: finalPath,
      color: brushColor,
      width: brushWidth,
      timestamp: Date.now(),
      boundingBox
    };

    onStrokeAdded(newStroke);

    setIsDrawing(false);
    setCurrentPath('');
    setCurrentPoints([]);
  }, [isDrawing, currentPoints, currentPath, autoStraighten, brushColor, brushWidth, onStrokeAdded]);

  const isApproximateLine = (points: Point[], threshold: number = 15): boolean => {
    if (points.length < 3) return true;

    const start = points[0];
    const end = points[points.length - 1];
    
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length < 10) return false;

    let maxDeviation = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const point = points[i];
      const A = dy;
      const B = -dx;
      const C = dx * start.y - dy * start.x;
      
      const distance = Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
      maxDeviation = Math.max(maxDeviation, distance);
    }

    return maxDeviation < threshold;
  };

  const calculateBoundingBox = (points: Point[]): BoundingBox => {
    if (points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;

    for (const point of points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const renderBackground = () => {
    switch (backgroundType) {
      case BackgroundType.RULED:
        return (
          <defs>
            <pattern id="ruled" patternUnits="userSpaceOnUse" width={width} height="20">
              <line x1="0" y1="20" x2={width} y2="20" stroke="#e0e0e0" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#ruled)"/>
          </defs>
        );
      case BackgroundType.GRID:
        return (
          <defs>
            <pattern id="grid" patternUnits="userSpaceOnUse" width="20" height="20">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </defs>
        );
      case BackgroundType.DOT_GRID:
        return (
          <defs>
            <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="10" cy="10" r="1" fill="#e0e0e0"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </defs>
        );
      default:
        return null;
    }
  };

  const handleStrokeClick = (strokeId: string) => {
    if (mode === DrawingMode.INK) {
      setSelectedStrokeId(selectedStrokeId === strokeId ? null : strokeId);
    }
  };

  const deleteSelectedStroke = () => {
    if (selectedStrokeId) {
      onStrokeDeleted(selectedStrokeId);
      setSelectedStrokeId(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' && selectedStrokeId) {
        deleteSelectedStroke();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStrokeId]);

  return (
    <CanvasContainer
      ref={canvasRef}
      width={width}
      height={height}
      onMouseDown={startDrawing}
      onMouseMove={continueDrawing}
      onMouseUp={finishDrawing}
      onMouseLeave={finishDrawing}
    >
      <SvgCanvas width={width} height={height}>
        {renderBackground()}
        
        {/* Existing strokes */}
        {strokes.map((stroke) => (
          <g key={stroke.id}>
            <path
              d={stroke.path}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{ pointerEvents: 'all', cursor: 'pointer' }}
              onClick={() => handleStrokeClick(stroke.id)}
            />
            {selectedStrokeId === stroke.id && stroke.boundingBox && (
              <rect
                x={stroke.boundingBox.x - 2}
                y={stroke.boundingBox.y - 2}
                width={stroke.boundingBox.width + 4}
                height={stroke.boundingBox.height + 4}
                fill="none"
                stroke="#007AFF"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            )}
          </g>
        ))}
        
        {/* Current drawing stroke */}
        {isDrawing && (
          <path
            d={currentPath}
            stroke={brushColor}
            strokeWidth={brushWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        )}
      </SvgCanvas>
      
      {/* Delete button for selected stroke */}
      {selectedStrokeId && (
        <button
          onClick={deleteSelectedStroke}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          Delete
        </button>
      )}
    </CanvasContainer>
  );
};