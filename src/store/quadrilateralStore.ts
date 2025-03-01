import { create } from "zustand";

export type Point = {
  x: number;
  y: number;
};

type QuadrilateralState = {
  points: Point[];
  activePointIndex: number | null;
  setPoints: (points: Point[]) => void;
  setActivePointIndex: (index: number | null) => void;
  updatePoint: (index: number, point: Point) => void;
};

// Initialize with default points forming a rectangle in the center
const initialPoints: Point[] = [
  { x: 0.25, y: 0.25 }, // Top-left
  { x: 0.75, y: 0.25 }, // Top-right
  { x: 0.75, y: 0.75 }, // Bottom-right
  { x: 0.25, y: 0.75 }, // Bottom-left
];

export const useQuadrilateralStore = create<QuadrilateralState>()((set) => ({
  points: initialPoints,
  activePointIndex: null,
  setPoints: (points: Point[]) => set({ points }),
  setActivePointIndex: (index: number | null) =>
    set({ activePointIndex: index }),
  updatePoint: (index: number, point: Point) =>
    set((state) => {
      const newPoints = [...state.points];
      newPoints[index] = point;
      return { points: newPoints };
    }),
}));
