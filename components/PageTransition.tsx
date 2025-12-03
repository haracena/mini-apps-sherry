"use client";

import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function PageTransition({
  children,
  className = "",
  delay = 0,
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-500 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface StaggerListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export function StaggerList({
  children,
  className = "",
  staggerDelay = 50,
}: StaggerListProps) {
  return (
    <>
      {children.map((child, index) => (
        <PageTransition
          key={index}
          delay={index * staggerDelay}
          className={className}
        >
          {child}
        </PageTransition>
      ))}
    </>
  );
}
