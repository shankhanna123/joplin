declare module 'react-native-ml-kit' {
  interface TextRecognitionResult {
    text: string;
    confidence: number;
    boundingBox: {
      left: number;
      top: number;
      width: number;
      height: number;
    };
  }

  const MLKit: {
    textRecognition: (imageUri: string) => Promise<TextRecognitionResult[]>;
  };
  export default MLKit;
}