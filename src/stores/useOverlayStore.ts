import { create } from 'zustand';

export enum Corner {
  Top_Left = 0,
  Top_Right = 1,
  Bottom_Right = 2,
  Bottom_Left = 3,
}

export type Point = {
  x: number;
  y: number;
};

type OverlayState = {
  points: Point[];
  activePointIndex: Corner | null;
  zoomLevel: number;
  setPoints: (points: Point[]) => void;
  setActivePointIndex: (corner: Corner | null) => void;
  updatePoint: (corner: Corner, point: Point) => void;
  setZoomLevel: (level: number) => void;
  batchUpdatePoint: (corner: Corner, point: Point) => void;
};

// Initialize with default points forming a rectangle in the center
const initialPoints: Point[] = [
  { x: 0.25, y: 0.25 }, // Top-left
  { x: 0.75, y: 0.25 }, // Top-right
  { x: 0.75, y: 0.75 }, // Bottom-right
  { x: 0.25, y: 0.75 }, // Bottom-left
];

// Maintain a reference to points outside the store to reduce renders
let pointsRef = [...initialPoints];
// Track last update time for debouncing
let lastUpdateTime = 0;
// Pending updates queue
let pendingUpdates: Array<{ corner: Corner; point: Point }> = [];
// Update timeout reference
let updateTimeoutId: NodeJS.Timeout | null = null;

export const useOverlayStore = create<OverlayState>()((set) => ({
  points: initialPoints,
  activePointIndex: null,
  zoomLevel: 5, // Default zoom level

  setPoints: (points: Point[]) => {
    // Update both the store and the external reference
    pointsRef = [...points];
    set({ points });
  },

  setActivePointIndex: (corner: Corner | null) =>
    set({ activePointIndex: corner }),

  // Standard update for non-gesture scenarios
  updatePoint: (corner: Corner, point: Point) =>
    set((state) => {
      // Create new points array with the update
      const newPoints = [...state.points];
      if (corner >= 0 && corner < newPoints.length) {
        newPoints[corner] = point;
        // Update reference
        pointsRef = newPoints;
        return { points: newPoints };
      }
      return {}; // No change if invalid corner
    }),

  // Optimized batch update for gestures - throttles and batches updates
  batchUpdatePoint: (corner: Corner, point: Point) => {
    // Safety check
    if (corner < 0 || corner >= pointsRef.length) return;

    // Update the reference immediately (doesn't trigger renders)
    pointsRef[corner] = { ...point };

    // Add to pending updates
    pendingUpdates.push({ corner, point });

    // Throttle the actual state update
    const now = Date.now();
    if (now - lastUpdateTime < 50) {
      // 50ms throttle
      // If we already have a pending update, let it handle this
      if (updateTimeoutId) return;

      // Schedule an update
      updateTimeoutId = setTimeout(() => {
        if (pendingUpdates.length > 0) {
          // Apply most recent update for each corner
          const updates = new Map<Corner, Point>();
          pendingUpdates.forEach((update) => {
            updates.set(update.corner, update.point);
          });

          // Create new array with all updates applied
          const newPoints = [...pointsRef];
          updates.forEach((point, corner) => {
            newPoints[corner] = point;
          });

          // Update the store
          set({ points: newPoints });
          lastUpdateTime = Date.now();
          pendingUpdates = [];
          updateTimeoutId = null;
        }
      }, 50);
      return;
    }

    // If enough time has passed, update immediately
    const newPoints = [...pointsRef];
    set({ points: newPoints });
    lastUpdateTime = now;
    pendingUpdates = [];

    // Clear any pending timeout
    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
      updateTimeoutId = null;
    }
  },

  setZoomLevel: (level: number) => set({ zoomLevel: level }),
}));
