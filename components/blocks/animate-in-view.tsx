"use client";

import React, { useEffect, useRef, useState } from "react";

interface AnimateInViewProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimateInView({
  children,
  className = "",
  style,
}: AnimateInViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "visible" : ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
