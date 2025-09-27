// React Native compatibility types for React 19
import * as React from 'react';

declare module 'react-native' {
  // Fix JSX compatibility issues with React 19
  interface ElementClass extends React.Component<any, any> {
    render(): React.ReactNode;
  }
}

// Additional React Native component type fixes
declare global {
  namespace JSX {
    interface ElementClass {
      render(): React.ReactNode;
    }
  }
}