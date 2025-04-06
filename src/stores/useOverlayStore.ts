import { create } from 'zustand';
import { Corner, Point } from '@types';

/**
 * Represents the state of the overlay store.
 * @property points - The points of the overlay
 * @property activePointIndex - The index of the active point
 * @property setPoints - Function to set the points of the overlay
 * @property setActivePointIndex - Function to set the active point index
 * @property updatePoint - Function to update a specific point
 * @property resetPoints - Function to reset the points to the initial state
 */
type OverlayState = {
  points: Point[];
  activePointIndex: Corner | null;
  setPoints: (points: Point[]) => void;
  setActivePointIndex: (corner: Corner | null) => void;
  updatePoint: (corner: Corner, point: Point) => void;
  resetPoints: () => void;
};

// Initialize with default points forming a rectangle in the center
export const initialPoints: Point[] = [
  { x: 0.25, y: 0.25 }, // Top-left
  { x: 0.75, y: 0.25 }, // Top-right
  { x: 0.75, y: 0.75 }, // Bottom-right
  { x: 0.25, y: 0.75 }, // Bottom-left
];

/**
 * Creates the overlay store using the Zustand library.
 * @param set - The set function from Zustand
 * @returns The overlay store
 */
export const useOverlayStore = create<OverlayState>()((set) => ({
  points: initialPoints,
  activePointIndex: null,
  setPoints: (points: Point[]) => set({ points }),
  setActivePointIndex: (corner: Corner | number | null) =>
    set({ activePointIndex: corner }),
  updatePoint: (corner: Corner, point: Point) =>
    set((state) => {
      const newPoints = [...state.points];
      newPoints[corner] = point;
      return { points: newPoints };
    }),
  resetPoints: () => set({ points: initialPoints }),
}));
