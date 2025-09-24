import React, { useRef, useCallback, useState, useEffect } from 'react';
import { View, PanResponder, Dimensions } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

interface InkStroke {
  id: string;
  path: string;
  color: string;
  width: number;
  timestamp: number;
}

interface InkingCanvasProps {
  onStrokeAdded: (stroke: InkStroke) => void;
  strokes: InkStroke[];
  brushColor: string;
  brushWidth: number;
  isEnabled: boolean;
}

export const InkingCanvas: React.FC<InkingCanvasProps> = ({
  onStrokeAdded,
  strokes,
  brushColor,
  brushWidth,
  isEnabled
}) => {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [isDrawing, setIsDrawing] = useState(false);
  const pathRef = useRef<string>('');

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => isEnabled,
    onMoveShouldSetPanResponder: () => isEnabled,

    onPanResponderGrant: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      pathRef.current = `M${locationX},${locationY}`;
      setCurrentPath(pathRef.current);
      setIsDrawing(true);
    },

    onPanResponderMove: (event) => {
      const { locationX, locationY } = event.nativeEvent;
      pathRef.current += ` L${locationX},${locationY}`;
      setCurrentPath(pathRef.current);
    },

    onPanResponderRelease: () => {
      if (pathRef.current) {
        const newStroke: InkStroke = {
          id: Date.now().toString(),
          path: pathRef.current,
          color: brushColor,
          width: brushWidth,
          timestamp: Date.now()
        };
        onStrokeAdded(newStroke);
      }
      setCurrentPath('');
      setIsDrawing(false);
      pathRef.current = '';
    }
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <G>
          {strokes.map((stroke) => (
            <Path
              key={stroke.id}
              d={stroke.path}
              stroke={stroke.color}
              strokeWidth={stroke.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ))}
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
  );
};
