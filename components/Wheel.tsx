"use client";

import { WHEEL_PRIZES } from "@/config/wheel-prizes";

interface WheelProps {
  rotation: number;
  isSpinning: boolean;
}

export function Wheel({ rotation, isSpinning }: WheelProps) {
  const segmentCount = WHEEL_PRIZES.length;
  const anglePerSegment = 360 / segmentCount;

  return (
    <div className="relative w-80 h-80 md:w-96 md:h-96">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
        <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-500 drop-shadow-lg" />
      </div>

      {/* Wheel Container */}
      <div
        className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-8 border-yellow-400 transition-transform duration-[4000ms] ease-out"
        style={{
          transform: `rotate(${rotation}deg)`,
          transitionTimingFunction: isSpinning
            ? "cubic-bezier(0.17, 0.67, 0.12, 0.99)"
            : "ease-out",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          style={{ transform: "rotate(-90deg)" }}
        >
          {WHEEL_PRIZES.map((prize, index) => {
            const startAngle = index * anglePerSegment;
            const endAngle = startAngle + anglePerSegment;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 100 + 100 * Math.cos(startRad);
            const y1 = 100 + 100 * Math.sin(startRad);
            const x2 = 100 + 100 * Math.cos(endRad);
            const y2 = 100 + 100 * Math.sin(endRad);

            const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

            const pathData = [
              `M 100 100`,
              `L ${x1} ${y1}`,
              `A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              `Z`,
            ].join(" ");

            // Calculate text position
            const textAngle = startAngle + anglePerSegment / 2;
            const textRad = (textAngle * Math.PI) / 180;
            const textRadius = 70;
            const textX = 100 + textRadius * Math.cos(textRad);
            const textY = 100 + textRadius * Math.sin(textRad);

            return (
              <g key={prize.id}>
                {/* Segment */}
                <path d={pathData} fill={prize.color} stroke="white" strokeWidth="2" />

                {/* Text */}
                <text
                  x={textX}
                  y={textY}
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${textAngle + 90}, ${textX}, ${textY})`}
                >
                  {prize.label}
                </text>
              </g>
            );
          })}

          {/* Center circle */}
          <circle cx="100" cy="100" r="15" fill="white" stroke="#fbbf24" strokeWidth="3" />
        </svg>
      </div>

      {/* Center dot decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-400 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
        <div className="w-3 h-3 bg-white rounded-full" />
      </div>
    </div>
  );
}
