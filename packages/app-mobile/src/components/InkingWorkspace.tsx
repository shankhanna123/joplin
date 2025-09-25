import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { InkingCanvas } from './InkingCanvas';
import { ModeToolbar } from './ModeToolbar';
import { BrushSettings } from './BrushSettings';
import { 
  InkStroke, 
  DrawingMode, 
  BackgroundType, 
  BackgroundSettings, 
  CanvasSettings, 
  Transform 
} from './InkingTypes';

interface InkingWorkspaceProps {
  onStrokesChange?: (strokes: InkStroke[]) => void;
  onTextRecognized?: (strokeId: string, text: string) => void;
  initialStrokes?: InkStroke[];
}

export const InkingWorkspace: React.FC<InkingWorkspaceProps> = ({
  onStrokesChange,
  onTextRecognized,
  initialStrokes = []
}) => {
  const [strokes, setStrokes] = useState<InkStroke[]>(initialStrokes);
  const [currentMode, setCurrentMode] = useState<DrawingMode>(DrawingMode.INK);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(3);
  const [backgroundType, setBackgroundType] = useState<BackgroundType>(BackgroundType.NONE);
  const [autoStraighten, setAutoStraighten] = useState(false);
  const [showBrushSettings, setShowBrushSettings] = useState(false);

  const screenDimensions = Dimensions.get('window');
  
  const [backgroundSettings] = useState<BackgroundSettings>({
    type: backgroundType,
    lineColor: '#e0e0e0',
    lineSpacing: 20,
    lineWidth: 1
  });

  const [canvasSettings] = useState<CanvasSettings>({
    width: screenDimensions.width,
    height: screenDimensions.height,
    infiniteCanvas: true,
    panEnabled: true,
    zoomEnabled: true
  });

  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    scale: 1
  });

  // Update background settings when type changes
  React.useEffect(() => {
    backgroundSettings.type = backgroundType;
  }, [backgroundType, backgroundSettings]);

  const handleStrokeAdded = useCallback((stroke: InkStroke) => {
    const newStrokes = [...strokes, stroke];
    setStrokes(newStrokes);
    onStrokesChange?.(newStrokes);
  }, [strokes, onStrokesChange]);

  const handleStrokeUpdated = useCallback((updatedStroke: InkStroke) => {
    const newStrokes = strokes.map(stroke => 
      stroke.id === updatedStroke.id ? updatedStroke : stroke
    );
    setStrokes(newStrokes);
    onStrokesChange?.(newStrokes);
  }, [strokes, onStrokesChange]);

  const handleStrokeDeleted = useCallback((strokeId: string) => {
    const newStrokes = strokes.filter(stroke => stroke.id !== strokeId);
    setStrokes(newStrokes);
    onStrokesChange?.(newStrokes);
  }, [strokes, onStrokesChange]);

  const handleModeChange = useCallback((mode: DrawingMode) => {
    setCurrentMode(mode);
    // Auto-show brush settings for ink modes
    setShowBrushSettings(mode === DrawingMode.INK || mode === DrawingMode.INK_TEXT);
  }, []);

  const handleBackgroundChange = useCallback((type: BackgroundType) => {
    setBackgroundType(type);
  }, []);

  const handleAutoStraightenToggle = useCallback((enabled: boolean) => {
    setAutoStraighten(enabled);
  }, []);

  const handleTransformChange = useCallback((newTransform: Transform) => {
    setTransform(newTransform);
  }, []);

  const handleTextRecognition = useCallback((strokeId: string, text: string) => {
    onTextRecognized?.(strokeId, text);
  }, [onTextRecognized]);

  const clearCanvas = useCallback(() => {
    setStrokes([]);
    onStrokesChange?.([]);
  }, [onStrokesChange]);

  const undoLastStroke = useCallback(() => {
    if (strokes.length > 0) {
      const newStrokes = strokes.slice(0, -1);
      setStrokes(newStrokes);
      onStrokesChange?.(newStrokes);
    }
  }, [strokes, onStrokesChange]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Mode Toolbar */}
      <ModeToolbar
        currentMode={currentMode}
        onModeChange={handleModeChange}
        backgroundType={backgroundType}
        onBackgroundChange={handleBackgroundChange}
        autoStraighten={autoStraighten}
        onAutoStraightenToggle={handleAutoStraightenToggle}
      />

      {/* Main Canvas Area */}
      <View style={styles.canvasContainer}>
        <InkingCanvas
          strokes={strokes}
          onStrokeAdded={handleStrokeAdded}
          onStrokeUpdated={handleStrokeUpdated}
          onStrokeDeleted={handleStrokeDeleted}
          brushColor={brushColor}
          brushWidth={brushWidth}
          isEnabled={true}
          mode={currentMode}
          backgroundSettings={backgroundSettings}
          canvasSettings={canvasSettings}
          transform={transform}
          onTransformChange={handleTransformChange}
          autoStraighten={autoStraighten}
          onTextRecognition={handleTextRecognition}
        />
      </View>

      {/* Brush Settings Panel */}
      {showBrushSettings && (
        <View style={styles.brushSettingsContainer}>
          <BrushSettings
            brushColor={brushColor}
            brushWidth={brushWidth}
            onColorChange={setBrushColor}
            onWidthChange={setBrushWidth}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  canvasContainer: {
    flex: 1,
    position: 'relative',
  },
  brushSettingsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
});