// Note: react-native-ml-kit is an optional dependency
// Create a separate type declaration file if the module is installed
import { captureRef } from 'react-native-view-shot';
import { Platform } from 'react-native';

// Google Vision types for compatibility
declare global {
  const GoogleVision: {
    textRecognition: (imageUri: string) => Promise<Array<{
      text: string;
      confidence: number;
      boundingBox: {
        left: number;
        top: number;
        width: number;
        height: number;
      };
    }>>;
  };
}

export interface RecognitionResult {
  text: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export class HandwritingRecognitionService {
  private static instance: HandwritingRecognitionService;

  public static getInstance(): HandwritingRecognitionService {
    if (!HandwritingRecognitionService.instance) {
      HandwritingRecognitionService.instance = new HandwritingRecognitionService();
    }
    return HandwritingRecognitionService.instance;
  }

  async recognizeText(imageUri: string): Promise<RecognitionResult[]> {
    try {
      const results = await GoogleVision.textRecognition(imageUri);
      
      return results.map((result: any) => ({
        text: result.text,
        confidence: result.confidence,
        boundingBox: {
          x: result.boundingBox.left,
          y: result.boundingBox.top,
          width: result.boundingBox.width,
          height: result.boundingBox.height,
        }
      }));
    } catch (error) {
      console.error('Handwriting recognition failed:', error);
      throw new Error('Failed to recognize handwriting');
    }
  }

  async convertInkToText(strokes: any[]): Promise<string> {
    // Convert SVG strokes to image and then recognize
    const imageUri = await this.strokesToImage(strokes);
    const results = await this.recognizeText(imageUri);
    
    return results.map(r => r.text).join(' ');
  }

  private async strokesToImage(strokes: any[]): Promise<string> {
    // For now, return a placeholder
    // In a real implementation, this would:
    // 1. Create an SVG element with the strokes
    // 2. Convert it to a canvas or use react-native-view-shot
    // 3. Export as base64 image
    
    try {
      // This is a simplified implementation
      // In practice, you would need to render the strokes to a view and capture it
      const svgData = this.createSVGFromStrokes(strokes);
      
      // For mobile, you might use react-native-svg-to-image or similar
      // For now, return a placeholder that would work with the recognition service
      return `data:image/png;base64,${this.convertSVGToBase64(svgData)}`;
    } catch (error) {
      console.error('Failed to convert strokes to image:', error);
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    }
  }

  private createSVGFromStrokes(strokes: any[]): string {
    const width = 400;
    const height = 300;
    
    let paths = '';
    strokes.forEach(stroke => {
      paths += `<path d="${stroke.path}" stroke="${stroke.color}" stroke-width="${stroke.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    });

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        ${paths}
      </svg>
    `;
  }

  private convertSVGToBase64(svgData: string): string {
    // This is a placeholder implementation
    // In a real app, you would use proper SVG to image conversion
    if (Platform.OS === 'web') {
      return btoa(svgData);
    }
    
    // For React Native, you'd need a native bridge or use a library
    // that can convert SVG to bitmap
    return Buffer.from(svgData).toString('base64');
  }

  async recognizeFromViewRef(viewRef: any): Promise<RecognitionResult[]> {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });
      
      return await this.recognizeText(uri);
    } catch (error) {
      console.error('Failed to capture view for recognition:', error);
      throw error;
    }
  }
}
