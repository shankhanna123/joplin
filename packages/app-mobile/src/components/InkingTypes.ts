export interface InkStroke {
  id: string;
  path: string;
  color: string;
  width: number;
  timestamp: number;
  isText?: boolean;
  recognizedText?: string;
  boundingBox?: BoundingBox;
  isSelected?: boolean;
  isResizable?: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Transform {
  x: number;
  y: number;
  scale: number;
}

export enum DrawingMode {
  TEXT = 'text',
  INK = 'ink',
  INK_TEXT = 'ink-text',
  LINE = 'line',
  SHAPE = 'shape'
}

export enum BackgroundType {
  NONE = 'none',
  RULED = 'ruled',
  GRID = 'grid',
  DOT_GRID = 'dot-grid'
}

export interface BackgroundSettings {
  type: BackgroundType;
  lineColor: string;
  lineSpacing: number;
  lineWidth: number;
}

export interface CanvasSettings {
  width: number;
  height: number;
  infiniteCanvas: boolean;
  panEnabled: boolean;
  zoomEnabled: boolean;
}

export interface InkingCanvasProps {
  onStrokeAdded: (stroke: InkStroke) => void;
  onStrokeUpdated: (stroke: InkStroke) => void;
  onStrokeDeleted: (strokeId: string) => void;
  strokes: InkStroke[];
  brushColor: string;
  brushWidth: number;
  isEnabled: boolean;
  mode: DrawingMode;
  backgroundSettings: BackgroundSettings;
  canvasSettings: CanvasSettings;
  transform: Transform;
  onTransformChange: (transform: Transform) => void;
  autoStraighten: boolean;
  onTextRecognition?: (strokeId: string, text: string) => void;
}

export interface ModeToolbarProps {
  currentMode: DrawingMode;
  onModeChange: (mode: DrawingMode) => void;
  backgroundType: BackgroundType;
  onBackgroundChange: (type: BackgroundType) => void;
  autoStraighten: boolean;
  onAutoStraightenToggle: (enabled: boolean) => void;
}

export interface ResizeHandle {
  id: string;
  x: number;
  y: number;
  cursor: string;
}

export interface InkObject {
  id: string;
  strokes: InkStroke[];
  boundingBox: BoundingBox;
  transform: Transform;
  isSelected: boolean;
  isResizable: boolean;
}