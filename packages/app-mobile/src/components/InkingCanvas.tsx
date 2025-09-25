import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, PanResponder, Dimensions, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, G, Rect } from 'react-native-svg';
import { 
  InkingCanvasProps, 
  InkStroke, 
  DrawingMode, 
  Point, 
  Transform,
  BoundingBox 
} from './InkingTypes';
import { CanvasBackground } from './CanvasBackground';
import { StrokeUtils } from '../utils/StrokeUtils';
import { HandwritingRecognitionService } from '../services/HandwritingRecognition';

export const InkingCanvas: React.FC<InkingCanvasProps> = ({
  onStrokeAdded,
  onStrokeUpdated,
  onStrokeDeleted,
  strokes,
  brushColor,
  brushWidth,
  isEnabled,
  mode,
  backgroundSettings,
  canvasSettings,
  transform,
  onTransformChange,
  autoStraighten,
  onTextRecognition
}) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [selectedStrokeId, setSelectedStrokeId] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  const pathRef = useRef<string>('');
  const pointsRef = useRef<Point[]>([]);
  const panStartRef = useRef<Point>({ x: 0, y: 0 });
  const lastTransformRef = useRef<Transform>(transform);

  const screenDimensions = Dimensions.get('window');
  const canvasWidth = canvasSettings.infiniteCanvas ? 
    Math.max(canvasSettings.width, screenDimensions.width * 2) : 
    canvasSettings.width;
  const canvasHeight = canvasSettings.infiniteCanvas ? 
    Math.max(canvasSettings.height, screenDimensions.height * 2) : 
    canvasSettings.height;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (event) => {
      if (!isEnabled) return false;
      
      const { locationX, locationY } = event.nativeEvent;
      const adjustedPoint = adjustPointForTransform({ x: locationX, y: locationY });
      
      // Check if touching a selected stroke for resizing/moving
      const touchedStroke = findStrokeAtPoint(adjustedPoint);
      if (touchedStroke && mode === DrawingMode.INK) {
        setSelectedStrokeId(touchedStroke.id);
        return true;
      }
      
      return mode !== DrawingMode.TEXT;
    },
    
    onMoveShouldSetPanResponder: () => isEnabled,

    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const adjustedPoint = adjustPointForTransform({ x: locationX, y: locationY });
      
      panStartRef.current = adjustedPoint;
      lastTransformRef.current = { ...transform };

      if (mode === DrawingMode.INK || mode === DrawingMode.INK_TEXT || mode === DrawingMode.LINE) {
        startDrawing(adjustedPoint);
      } else if (canvasSettings.panEnabled && (mode === DrawingMode.TEXT || event.nativeEvent.touches.length > 1)) {
        setIsPanning(true);
      }
    },

    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      const adjustedPoint = adjustPointForTransform({ x: locationX, y: locationY });

      if (isPanning) {
        handlePanning(adjustedPoint);
      } else if (isDrawing) {
        continueDrawing(adjustedPoint);
      }
    },

    onPanResponderRelease: async () => {
      if (isDrawing) {
        await finishDrawing();
      } else if (isPanning) {
        setIsPanning(false);
      }
      
      setSelectedStrokeId(null);
      setIsResizing(false);
    }
  });

  const adjustPointForTransform = (point: Point): Point => ({
    x: (point.x - transform.x) / transform.scale,
    y: (point.y - transform.y) / transform.scale
  });

  const findStrokeAtPoint = (point: Point): InkStroke | null => {
    for (const stroke of [...strokes].reverse()) {
      const points = StrokeUtils.parsePathToPoints(stroke.path);
      const boundingBox = StrokeUtils.calculateBoundingBox(points);
      
      if (StrokeUtils.isPointInBoundingBox(point, boundingBox, 10)) {
        return stroke;
      }
    }
    return null;
  };

  const startDrawing = (point: Point) => {
    pointsRef.current = [point];
    pathRef.current = `M${point.x},${point.y}`;
    setCurrentPath(pathRef.current);
    setCurrentPoints([point]);
    setIsDrawing(true);
  };

  const continueDrawing = (point: Point) => {
    if (mode === DrawingMode.LINE) {
      // For line mode, only keep start and current point
      pointsRef.current = [pointsRef.current[0], point];
      pathRef.current = `M${pointsRef.current[0].x},${pointsRef.current[0].y} L${point.x},${point.y}`;
    } else {
      pointsRef.current.push(point);
      pathRef.current += ` L${point.x},${point.y}`;
    }
    
    setCurrentPath(pathRef.current);
    setCurrentPoints([...pointsRef.current]);
  };

  const handlePanning = (currentPoint: Point) => {
    if (!canvasSettings.panEnabled) return;

    const dx = currentPoint.x - panStartRef.current.x;
    const dy = currentPoint.y - panStartRef.current.y;

    const newTransform: Transform = {
      x: lastTransformRef.current.x + dx * transform.scale,
      y: lastTransformRef.current.y + dy * transform.scale,
      scale: transform.scale
    };

    onTransformChange(newTransform);
  };

  const finishDrawing = async () => {
    if (pointsRef.current.length === 0) {
      setIsDrawing(false);
      setCurrentPath('');
      setCurrentPoints([]);
      return;
    }

    let finalPoints = [...pointsRef.current];
    let finalPath = pathRef.current;

    // Apply auto-straightening if enabled and stroke is approximately a line
    if (autoStraighten && StrokeUtils.isApproximateLine(finalPoints)) {
      finalPoints = StrokeUtils.straightenStroke(finalPoints);
      finalPath = StrokeUtils.pointsToPath(finalPoints);
    }

    // Apply smoothing for non-line modes
    if (mode !== DrawingMode.LINE && finalPoints.length > 3) {
      finalPoints = StrokeUtils.smoothStroke(finalPoints);
      finalPath = StrokeUtils.pointsToPath(finalPoints);
    }

    const boundingBox = StrokeUtils.calculateBoundingBox(finalPoints);
    const newStroke: InkStroke = {
      id: Date.now().toString(),
      path: finalPath,
      color: brushColor,
      width: brushWidth,
      timestamp: Date.now(),
      boundingBox,
      isResizable: mode === DrawingMode.INK || mode === DrawingMode.INK_TEXT,
      isText: mode === DrawingMode.INK_TEXT
    };

    onStrokeAdded(newStroke);

    // Perform handwriting recognition for ink-text mode
    if (mode === DrawingMode.INK_TEXT && onTextRecognition) {
      try {
        const recognitionService = HandwritingRecognitionService.getInstance();
        const recognizedText = await recognitionService.convertInkToText([newStroke]);
        
        if (recognizedText) {
          const updatedStroke = { 
            ...newStroke, 
            recognizedText,
            isText: true 
          };
          onStrokeUpdated(updatedStroke);
          onTextRecognition(newStroke.id, recognizedText);
        }
      } catch (error) {
        console.warn('Text recognition failed:', error);
      }
    }

    // Reset drawing state
    setIsDrawing(false);
    setCurrentPath('');
    setCurrentPoints([]);
    pathRef.current = '';
    pointsRef.current = [];
  };

  const handleStrokePress = (stroke: InkStroke) => {
    if (mode === DrawingMode.INK) {
      setSelectedStrokeId(selectedStrokeId === stroke.id ? null : stroke.id);
    }
  };

  const deleteSelectedStroke = () => {
    if (selectedStrokeId) {
      onStrokeDeleted(selectedStrokeId);
      setSelectedStrokeId(null);
    }
  };

  const renderResizeHandles = (stroke: InkStroke) => {
    if (!stroke.boundingBox || selectedStrokeId !== stroke.id) return null;

    const handles = StrokeUtils.createResizeHandles(stroke.boundingBox);
    
    return handles.map(handle => (
      <Rect
        key={handle.id}
        x={handle.x}
        y={handle.y}
        width={8}
        height={8}
        fill="#007AFF"
        stroke="#ffffff"
        strokeWidth={1}
      />
    ));
  };

  const renderSelectedStrokeOverlay = (stroke: InkStroke) => {
    if (selectedStrokeId !== stroke.id || !stroke.boundingBox) return null;

    return (
      <Rect
        x={stroke.boundingBox.x - 2}
        y={stroke.boundingBox.y - 2}
        width={stroke.boundingBox.width + 4}
        height={stroke.boundingBox.height + 4}
        fill="none"
        stroke="#007AFF"
        strokeWidth={1}
        strokeDasharray="5,5"
      />
    );
  };

  const renderTextOverlay = (stroke: InkStroke) => {
    if (!stroke.isText || !stroke.recognizedText || !stroke.boundingBox) return null;

    return (
      <Text
        style={{
          position: 'absolute',
          left: stroke.boundingBox.x * transform.scale + transform.x,
          top: (stroke.boundingBox.y + stroke.boundingBox.height + 20) * transform.scale + transform.y,
          fontSize: 12,
          color: '#666',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: 4,
          borderRadius: 4,
          maxWidth: 200,
        }}
      >
        {stroke.recognizedText}
      </Text>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      {/* Background */}
      <View 
        style={{ 
          position: 'absolute',
          left: transform.x,
          top: transform.y,
          transform: [{ scale: transform.scale }]
        }}
      >
        <CanvasBackground
          settings={backgroundSettings}
          width={canvasWidth}
          height={canvasHeight}
        />
      </View>

      {/* Main Canvas */}
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <Svg 
          style={{ 
            position: 'absolute', 
            left: transform.x,
            top: transform.y,
            transform: [{ scale: transform.scale }]
          }}
          width={canvasWidth}
          height={canvasHeight}
        >
          <G>
            {/* Existing strokes */}
            {strokes.map((stroke) => (
              <G key={stroke.id}>
                <Path
                  d={stroke.path}
                  stroke={stroke.color}
                  strokeWidth={stroke.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  onPress={() => handleStrokePress(stroke)}
                />
                {renderSelectedStrokeOverlay(stroke)}
                {renderResizeHandles(stroke)}
              </G>
            ))}
            
            {/* Current drawing stroke */}
            {isDrawing && (
              <Path
                d={currentPath}
                stroke={brushColor}
                strokeWidth={brushWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </G>
        </Svg>
      </View>

      {/* Text recognition overlays */}
      {strokes.map(stroke => (
        <View key={`text-${stroke.id}`}>
          {renderTextOverlay(stroke)}
        </View>
      ))}

      {/* Delete button for selected stroke */}
      {selectedStrokeId && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 60,
            right: 20,
            backgroundColor: '#ff4444',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}
          onPress={deleteSelectedStroke}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
