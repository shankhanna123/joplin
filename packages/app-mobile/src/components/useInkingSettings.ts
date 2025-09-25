import { useState, useEffect } from 'react';
import Setting from '@joplin/lib/models/Setting';
import { BackgroundType } from './InkingTypes';

export interface InkingSettings {
  enabled: boolean;
  autoStraighten: boolean;
  defaultBrushColor: string;
  defaultBrushWidth: number;
  defaultBackgroundType: BackgroundType;
  handwritingRecognition: boolean;
  infiniteCanvas: boolean;
}

/**
 * Hook to manage inking settings with Joplin's settings system
 */
export const useInkingSettings = () => {
  const [settings, setSettings] = useState<InkingSettings>({
    enabled: true,
    autoStraighten: true,
    defaultBrushColor: '#000000',
    defaultBrushWidth: 3,
    defaultBackgroundType: BackgroundType.NONE,
    handwritingRecognition: true,
    infiniteCanvas: true,
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const newSettings: InkingSettings = {
          enabled: Setting.value('inking.enabled'),
          autoStraighten: Setting.value('inking.autoStraighten'),
          defaultBrushColor: Setting.value('inking.defaultBrushColor'),
          defaultBrushWidth: Setting.value('inking.defaultBrushWidth'),
          defaultBackgroundType: Setting.value('inking.defaultBackgroundType') as BackgroundType,
          handwritingRecognition: Setting.value('inking.handwritingRecognition'),
          infiniteCanvas: Setting.value('inking.infiniteCanvas'),
        };
        
        setSettings(newSettings);
      } catch (error) {
        console.warn('Failed to load inking settings:', error);
      }
    };

    loadSettings();

    // Listen for setting changes
    const handleSettingChange = () => {
      loadSettings();
    };

    Setting.onChange(handleSettingChange);

    return () => {
      Setting.offChange(handleSettingChange);
    };
  }, []);

  const updateSetting = async <K extends keyof InkingSettings>(
    key: K,
    value: InkingSettings[K]
  ) => {
    const settingKey = `inking.${key}`;
    
    try {
      await Setting.setValue(settingKey, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.error(`Failed to update setting ${settingKey}:`, error);
    }
  };

  const resetToDefaults = async () => {
    const defaultSettings: InkingSettings = {
      enabled: true,
      autoStraighten: true,
      defaultBrushColor: '#000000',
      defaultBrushWidth: 3,
      defaultBackgroundType: BackgroundType.NONE,
      handwritingRecognition: true,
      infiniteCanvas: true,
    };

    try {
      await Promise.all([
        Setting.setValue('inking.enabled', defaultSettings.enabled),
        Setting.setValue('inking.autoStraighten', defaultSettings.autoStraighten),
        Setting.setValue('inking.defaultBrushColor', defaultSettings.defaultBrushColor),
        Setting.setValue('inking.defaultBrushWidth', defaultSettings.defaultBrushWidth),
        Setting.setValue('inking.defaultBackgroundType', defaultSettings.defaultBackgroundType),
        Setting.setValue('inking.handwritingRecognition', defaultSettings.handwritingRecognition),
        Setting.setValue('inking.infiniteCanvas', defaultSettings.infiniteCanvas),
      ]);

      setSettings(defaultSettings);
    } catch (error) {
      console.error('Failed to reset inking settings:', error);
    }
  };

  return {
    settings,
    updateSetting,
    resetToDefaults,
  };
};