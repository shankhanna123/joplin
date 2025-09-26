import React, { useState, useCallback } from 'react';
import { View, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { InkingWorkspace } from '../components/InkingWorkspace';
import { InkStroke } from '../components/InkingTypes';

/**
 * Example implementation showing how to integrate the InkingWorkspace
 * into a note editor or standalone drawing application
 */
export const InkingExample: React.FC = () => {
  const [noteStrokes, setNoteStrokes] = useState<InkStroke[]>([]);

  const handleStrokesChange = useCallback((strokes: InkStroke[]) => {
    setNoteStrokes(strokes);
    
    // Here you could save the strokes to your data store
    console.log('Strokes updated:', strokes.length);
  }, []);

  const handleTextRecognized = useCallback((_strokeId: string, text: string) => {
    Alert.alert(
      'Text Recognized',
      `Recognized text: "${text}"`,
      [
        {
          text: 'OK',
          onPress: () => {
            // Here you could insert the recognized text into your note
            console.log('Insert recognized text:', text);
          }
        }
      ]
    );
  }, []);

  return (
    <View style={styles.container}>
      <InkingWorkspace
        onStrokesChange={handleStrokesChange}
        onTextRecognized={handleTextRecognized}
        initialStrokes={noteStrokes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

/**
 * Example of how to integrate inking into a note editor
 */
export const NoteEditorWithInking: React.FC = () => {
  const [isInkingMode, setIsInkingMode] = useState(false);
  const [inkingStrokes, setInkingStrokes] = useState<InkStroke[]>([]);

  const toggleInkingMode = () => {
    setIsInkingMode(!isInkingMode);
  };

  const handleInkingStrokesChange = (strokes: InkStroke[]) => {
    setInkingStrokes(strokes);
    // Save strokes as part of note data
  };

  const handleTextRecognition = (_strokeId: string, text: string) => {
    // Insert recognized text into note content
    console.log('Recognized text:', text);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={extendedStyles.toggleButton} 
        onPress={toggleInkingMode}
      >
        <Text style={extendedStyles.toggleButtonText}>
          {isInkingMode ? 'Switch to Text' : 'Switch to Inking'}
        </Text>
      </TouchableOpacity>
      
      {isInkingMode ? (
        <InkingWorkspace
          onStrokesChange={handleInkingStrokesChange}
          onTextRecognized={handleTextRecognition}
          initialStrokes={inkingStrokes}
        />
      ) : (
        <View style={extendedStyles.textEditor}>
          {/* Your regular text editor would go here */}
        </View>
      )}
    </View>
  );
};

const extendedStyles = StyleSheet.create({
  ...styles,
  textEditor: {
    flex: 1,
    padding: 16,
  },
  toggleButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});