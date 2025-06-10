"use client";
import Tilt from "react-parallax-tilt";

type TiltFrameProps = {
  children: React.ReactNode;
};

export default function TiltFrame({ children }: TiltFrameProps) {
  return (
    <Tilt
      className="w-fit hover:scale-105 transition-all duration-300 relative group"
      glareEnable={true}
      glareMaxOpacity={0.8}
      glareColor="#ffffff"
      glarePosition="bottom"
      glareBorderRadius="8px"
    >
      {/* <div className="size-[120px] opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-[100px] -z-10"></div> */}
      {children}
    </Tilt>
  );
}
