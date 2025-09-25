import React from 'react';
import { DrawingMode, BackgroundType } from './InkingTypes';

// Basic test to ensure types and enums are correctly defined
describe('InkingCanvas Types', () => {
  it('should have correct DrawingMode enum values', () => {
    expect(DrawingMode.TEXT).toBe('text');
    expect(DrawingMode.INK).toBe('ink');
    expect(DrawingMode.INK_TEXT).toBe('ink-text');
    expect(DrawingMode.LINE).toBe('line');
    expect(DrawingMode.SHAPE).toBe('shape');
  });

  it('should have correct BackgroundType enum values', () => {
    expect(BackgroundType.NONE).toBe('none');
    expect(BackgroundType.RULED).toBe('ruled');
    expect(BackgroundType.GRID).toBe('grid');
    expect(BackgroundType.DOT_GRID).toBe('dot-grid');
  });
});