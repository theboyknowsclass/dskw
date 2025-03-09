import { create } from "zustand";

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
};

// Initialize with default points forming a rectangle in the center
const initialPoints: Point[] = [
  { x: 0.25, y: 0.25 }, // Top-left
  { x: 0.75, y: 0.25 }, // Top-right
  { x: 0.75, y: 0.75 }, // Bottom-right
  { x: 0.25, y: 0.75 }, // Bottom-left
];

export const useOverlayStore = create<OverlayState>()((set) => ({
  points: initialPoints,
  activePointIndex: null,
  zoomLevel: 5, // Default zoom level
  setPoints: (points: Point[]) => set({ points }),
  setActivePointIndex: (corner: Corner | null) =>
    set({ activePointIndex: corner }),
  updatePoint: (corner: Corner, point: Point) =>
    set((state) => {
      const newPoints = [...state.points];
      newPoints[corner] = point;
      return { points: newPoints };
    }),
  setZoomLevel: (level: number) => set({ zoomLevel: level }),
}));
