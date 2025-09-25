import { StrokeUtils } from './StrokeUtils';

describe('StrokeUtils', () => {
  describe('parsePathToPoints', () => {
    it('should parse simple SVG path correctly', () => {
      const path = 'M10,20 L30,40';
      const points = StrokeUtils.parsePathToPoints(path);
      
      expect(points).toHaveLength(2);
      expect(points[0]).toEqual({ x: 10, y: 20 });
      expect(points[1]).toEqual({ x: 30, y: 40 });
    });

    it('should handle empty path', () => {
      const points = StrokeUtils.parsePathToPoints('');
      expect(points).toHaveLength(0);
    });
  });

  describe('pointsToPath', () => {
    it('should convert points to SVG path', () => {
      const points = [
        { x: 10, y: 20 },
        { x: 30, y: 40 },
        { x: 50, y: 60 }
      ];
      
      const path = StrokeUtils.pointsToPath(points);
      expect(path).toBe('M10,20 L30,40 L50,60');
    });

    it('should handle empty points array', () => {
      const path = StrokeUtils.pointsToPath([]);
      expect(path).toBe('');
    });
  });

  describe('calculateBoundingBox', () => {
    it('should calculate correct bounding box', () => {
      const points = [
        { x: 10, y: 20 },
        { x: 50, y: 40 },
        { x: 30, y: 60 }
      ];
      
      const bbox = StrokeUtils.calculateBoundingBox(points);
      expect(bbox).toEqual({
        x: 10,
        y: 20,
        width: 40,
        height: 40
      });
    });

    it('should handle empty points', () => {
      const bbox = StrokeUtils.calculateBoundingBox([]);
      expect(bbox).toEqual({ x: 0, y: 0, width: 0, height: 0 });
    });
  });

  describe('isApproximateLine', () => {
    it('should detect straight line', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 20, y: 20 }
      ];
      
      expect(StrokeUtils.isApproximateLine(points)).toBe(true);
    });

    it('should detect curved line', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 10, y: 50 },
        { x: 20, y: 20 }
      ];
      
      expect(StrokeUtils.isApproximateLine(points)).toBe(false);
    });
  });

  describe('straightenStroke', () => {
    it('should return start and end points only', () => {
      const points = [
        { x: 0, y: 0 },
        { x: 5, y: 5 },
        { x: 10, y: 10 },
        { x: 20, y: 20 }
      ];
      
      const straightened = StrokeUtils.straightenStroke(points);
      expect(straightened).toHaveLength(2);
      expect(straightened[0]).toEqual({ x: 0, y: 0 });
      expect(straightened[1]).toEqual({ x: 20, y: 20 });
    });
  });
});