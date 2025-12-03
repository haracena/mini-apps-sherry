import type { WheelPrize } from "@/types";

/**
 * Wheel prize configuration
 * Must match smart contract prize distribution:
 * - 40% chance: 10-20 points
 * - 30% chance: 30-40 points
 * - 20% chance: 50-70 points
 * - 8% chance: 80-100 points
 * - 2% chance: 120-150 points
 */
export const WHEEL_PRIZES: WheelPrize[] = [
  {
    id: 1,
    minPoints: 10,
    maxPoints: 20,
    probability: 0.4,
    color: "#3B82F6", // Blue
    label: "10-20",
  },
  {
    id: 2,
    minPoints: 30,
    maxPoints: 40,
    probability: 0.3,
    color: "#8B5CF6", // Purple
    label: "30-40",
  },
  {
    id: 3,
    minPoints: 10,
    maxPoints: 20,
    probability: 0.4,
    color: "#3B82F6", // Blue (duplicate for wheel symmetry)
    label: "10-20",
  },
  {
    id: 4,
    minPoints: 50,
    maxPoints: 70,
    probability: 0.2,
    color: "#10B981", // Green
    label: "50-70",
  },
  {
    id: 5,
    minPoints: 30,
    maxPoints: 40,
    probability: 0.3,
    color: "#8B5CF6", // Purple (duplicate for wheel symmetry)
    label: "30-40",
  },
  {
    id: 6,
    minPoints: 80,
    maxPoints: 100,
    probability: 0.08,
    color: "#F59E0B", // Amber
    label: "80-100",
  },
  {
    id: 7,
    minPoints: 10,
    maxPoints: 20,
    probability: 0.4,
    color: "#3B82F6", // Blue
    label: "10-20",
  },
  {
    id: 8,
    minPoints: 120,
    maxPoints: 150,
    probability: 0.02,
    color: "#EF4444", // Red (jackpot)
    label: "120-150",
  },
];

/**
 * Get prize segment by points value
 * Used to determine which segment won after spin
 */
export function getPrizeByPoints(points: number): WheelPrize | undefined {
  return WHEEL_PRIZES.find(
    (prize) => points >= prize.minPoints && points <= prize.maxPoints
  );
}

/**
 * Get rotation angle for a specific prize segment
 * @param segmentIndex - Index of the segment (0-7)
 * @returns Rotation angle in degrees
 */
export function getSegmentAngle(segmentIndex: number): number {
  const segmentsCount = WHEEL_PRIZES.length;
  const anglePerSegment = 360 / segmentsCount;
  return segmentIndex * anglePerSegment;
}

/**
 * Calculate final rotation to land on specific prize
 * @param points - Points won
 * @returns Total rotation in degrees
 */
export function calculateWinRotation(points: number): number {
  const prize = getPrizeByPoints(points);
  if (!prize) return 0;

  const segmentIndex = WHEEL_PRIZES.findIndex((p) => p.id === prize.id);
  const baseAngle = getSegmentAngle(segmentIndex);

  // Add randomness within the segment
  const segmentSize = 360 / WHEEL_PRIZES.length;
  const randomOffset = Math.random() * segmentSize - segmentSize / 2;

  // Add multiple full rotations for visual effect (5-7 full spins)
  const fullRotations = 5 + Math.floor(Math.random() * 3);
  const totalRotation = fullRotations * 360 + baseAngle + randomOffset;

  return totalRotation;
}
