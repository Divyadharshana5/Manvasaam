
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TRAIL_LENGTH = 8; // Number of trailing dots

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        window.getComputedStyle(target).cursor === "pointer";
      
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => {
        const springX = useSpring(cursorX, {
          ...springConfig,
          damping: 20 + i * 5,
        });
        const springY = useSpring(cursorY, {
          ...springConfig,
          damping: 20 + i * 5,
        });

        const isHead = i === 0;
        
        return (
          <motion.div
            key={i}
            className={isHead ? "cursor-dot" : "cursor-trail"}
            style={{
              translateX: springX,
              translateY: springY,
              scale: isHead ? (isHovering ? 1.5 : 1) : (TRAIL_LENGTH - i) / TRAIL_LENGTH,
              x: '-50%',
              y: '-50%',
            }}
            transition={{
                type: 'spring',
                damping: 15,
                stiffness: 200,
                mass: 0.3
            }}
          />
        );
      })}
    </>
  );
};

export default CustomCursor;
