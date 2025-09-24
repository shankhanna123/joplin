import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { ColorPicker } from './ColorPicker';

interface BrushSettingsProps {
  brushColor: string;
  brushWidth: number;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
}

export const BrushSettings: React.FC<BrushSettingsProps> = ({
  brushColor,
  brushWidth,
  onColorChange,
  onWidthChange
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Brush Size: {brushWidth.toFixed(1)}px</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={20}
        value={brushWidth}
        onValueChange={onWidthChange}
        thumbStyle={styles.thumb}
        trackStyle={styles.track}
      />
      
      <ColorPicker
        selectedColor={brushColor}
        onColorSelect={onColorChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: '#007AFF',
  },
  track: {
    height: 4,
    backgroundColor: '#ddd',
  },
});
