import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { DrawingMode, BackgroundType, ModeToolbarProps } from './InkingTypes';

const modeIcons = {
  [DrawingMode.TEXT]: '✏️',
  [DrawingMode.INK]: '🖊️',
  [DrawingMode.INK_TEXT]: '📝',
  [DrawingMode.LINE]: '📏',
  [DrawingMode.SHAPE]: '⬜'
};

const backgroundIcons = {
  [BackgroundType.NONE]: '⬜',
  [BackgroundType.RULED]: '📄',
  [BackgroundType.GRID]: '⊞',
  [BackgroundType.DOT_GRID]: '⋯'
};

export const ModeToolbar: React.FC<ModeToolbarProps> = ({
  currentMode,
  onModeChange,
  backgroundType,
  onBackgroundChange,
  autoStraighten,
  onAutoStraightenToggle
}) => {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.toolbar}>
          {/* Drawing Modes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Mode</Text>
            <View style={styles.buttonGroup}>
              {Object.values(DrawingMode).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.button,
                    currentMode === mode && styles.activeButton
                  ]}
                  onPress={() => onModeChange(mode)}
                >
                  <Text style={styles.buttonIcon}>{modeIcons[mode]}</Text>
                  <Text style={[
                    styles.buttonText,
                    currentMode === mode && styles.activeButtonText
                  ]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1).replace('-', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Background Types */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Background</Text>
            <View style={styles.buttonGroup}>
              {Object.values(BackgroundType).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.button,
                    backgroundType === type && styles.activeButton
                  ]}
                  onPress={() => onBackgroundChange(type)}
                >
                  <Text style={styles.buttonIcon}>{backgroundIcons[type]}</Text>
                  <Text style={[
                    styles.buttonText,
                    backgroundType === type && styles.activeButtonText
                  ]}>
                    {type === BackgroundType.NONE ? 'None' :
                     type === BackgroundType.RULED ? 'Ruled' :
                     type === BackgroundType.GRID ? 'Grid' : 'Dot Grid'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Auto Straighten */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Options</Text>
            <TouchableOpacity
              style={[
                styles.button,
                autoStraighten && styles.activeButton
              ]}
              onPress={() => onAutoStraightenToggle(!autoStraighten)}
            >
              <Text style={styles.buttonIcon}>📐</Text>
              <Text style={[
                styles.buttonText,
                autoStraighten && styles.activeButtonText
              ]}>
                Auto Straighten
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingVertical: 8,
  },
  toolbar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  section: {
    marginRight: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    minWidth: 70,
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  buttonText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#495057',
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#ffffff',
  },
});