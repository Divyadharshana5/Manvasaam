
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [hoveredElement, setHoveredElement] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

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

      if (isInteractive) {
        const rect = target.getBoundingClientRect();
        setHoveredElement({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
      } else {
        setHoveredElement(null);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  const cursorSize = hoveredElement ? 60 : 20;

  const cursorStyle = {
    translateX: springX,
    translateY: springY,
    width: cursorSize,
    height: cursorSize,
    left: hoveredElement ? hoveredElement.x - (cursorSize - hoveredElement.width) / 2 : -100,
    top: hoveredElement ? hoveredElement.y - (cursorSize - hoveredElement.height) / 2 : -100,
  };
  
  if (hoveredElement) {
    cursorStyle.translateX = hoveredElement.x + hoveredElement.width / 2;
    cursorStyle.translateY = hoveredElement.y + hoveredElement.height / 2;
  }


  return (
    <motion.div
      className="custom-cursor"
      style={cursorStyle}
      animate={{ 
        width: cursorSize, 
        height: cursorSize,
        x: hoveredElement ? hoveredElement.x + hoveredElement.width / 2 - cursorSize/2: springX,
        y: hoveredElement ? hoveredElement.y + hoveredElement.height / 2 - cursorSize/2: springY,
      }}
      transition={springConfig}
    />
  );
};

export default CustomCursor;
