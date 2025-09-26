import { Point, BoundingBox } from '../components/InkingTypes';

export class StrokeUtils {
  /**
   * Parse SVG path string to array of points
   */
  static parsePathToPoints(path: string): Point[] {
    const points: Point[] = [];
    const commands = path.split(/(?=[ML])/);
    
    for (const command of commands) {
      if (command.startsWith('M') || command.startsWith('L')) {
        const coords = command.substring(1).split(',');
        if (coords.length >= 2) {
          points.push({
            x: parseFloat(coords[0]),
            y: parseFloat(coords[1])
          });
        }
      }
    }
    
    return points;
  }

  /**
   * Convert array of points to SVG path string
   */
  static pointsToPath(points: Point[]): string {
    if (points.length === 0) return '';
    
    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L${points[i].x},${points[i].y}`;
    }
    
    return path;
  }

  /**
   * Calculate bounding box for a stroke
   */
  static calculateBoundingBox(points: Point[]): BoundingBox {
    if (points.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    let minX = points[0].x;
    let maxX = points[0].x;
    let minY = points[0].y;
    let maxY = points[0].y;

    for (const point of points) {
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }

  /**
   * Detect if a stroke is approximately a straight line
   */
  static isApproximateLine(points: Point[], threshold: number = 15): boolean {
    if (points.length < 3) return true;

    const start = points[0];
    const end = points[points.length - 1];
    
    // Calculate expected line equation
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    if (length < 10) return false; // Too short to be a meaningful line

    // Check deviation of intermediate points from the straight line
    let maxDeviation = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const point = points[i];
      
      // Calculate perpendicular distance from point to line
      const A = dy;
      const B = -dx;
      const C = dx * start.y - dy * start.x;
      
      const distance = Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
      maxDeviation = Math.max(maxDeviation, distance);
    }

    return maxDeviation < threshold;
  }

  /**
   * Straighten a stroke to a perfect line
   */
  static straightenStroke(points: Point[]): Point[] {
    if (points.length < 2) return points;

    const start = points[0];
    const end = points[points.length - 1];
    
    return [start, end];
  }

  /**
   * Smooth a stroke using simple moving average
   */
  static smoothStroke(points: Point[], windowSize: number = 3): Point[] {
    if (points.length <= windowSize) return points;

    const smoothed: Point[] = [];
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = 0; i < points.length; i++) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;

      const start = Math.max(0, i - halfWindow);
      const end = Math.min(points.length - 1, i + halfWindow);

      for (let j = start; j <= end; j++) {
        sumX += points[j].x;
        sumY += points[j].y;
        count++;
      }

      smoothed.push({
        x: sumX / count,
        y: sumY / count
      });
    }

    return smoothed;
  }

  /**
   * Check if a point is within a bounding box
   */
  static isPointInBoundingBox(point: Point, boundingBox: BoundingBox, padding: number = 0): boolean {
    return point.x >= boundingBox.x - padding &&
           point.x <= boundingBox.x + boundingBox.width + padding &&
           point.y >= boundingBox.y - padding &&
           point.y <= boundingBox.y + boundingBox.height + padding;
  }

  /**
   * Transform points by scale and translation
   */
  static transformPoints(points: Point[], scale: number, translateX: number, translateY: number): Point[] {
    return points.map(point => ({
      x: point.x * scale + translateX,
      y: point.y * scale + translateY
    }));
  }

  /**
   * Create resize handles for a bounding box
   */
  static createResizeHandles(boundingBox: BoundingBox) {
    const handles = [];
    const { x, y, width, height } = boundingBox;
    const handleSize = 8;

    // Corner handles
    handles.push(
      { id: 'nw', x: x - handleSize/2, y: y - handleSize/2, cursor: 'nw-resize' },
      { id: 'ne', x: x + width - handleSize/2, y: y - handleSize/2, cursor: 'ne-resize' },
      { id: 'sw', x: x - handleSize/2, y: y + height - handleSize/2, cursor: 'sw-resize' },
      { id: 'se', x: x + width - handleSize/2, y: y + height - handleSize/2, cursor: 'se-resize' }
    );

    // Edge handles
    handles.push(
      { id: 'n', x: x + width/2 - handleSize/2, y: y - handleSize/2, cursor: 'n-resize' },
      { id: 's', x: x + width/2 - handleSize/2, y: y + height - handleSize/2, cursor: 's-resize' },
      { id: 'w', x: x - handleSize/2, y: y + height/2 - handleSize/2, cursor: 'w-resize' },
      { id: 'e', x: x + width - handleSize/2, y: y + height/2 - handleSize/2, cursor: 'e-resize' }
    );

    return handles;
  }
}