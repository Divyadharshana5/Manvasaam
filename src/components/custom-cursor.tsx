
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button') || window.getComputedStyle(target).cursor === 'pointer';
        setIsHovering(isInteractive);
    };
    
    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  const cursorVariants = {
    default: {
      scale: 0.5,
      backgroundColor: "hsl(var(--primary))",
      borderColor: "transparent"
    },
    hover: {
      scale: 1.5,
      backgroundColor: "transparent",
      borderColor: "hsl(var(--primary))"
    }
  }

  return (
    <motion.div
      className="custom-cursor"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
      variants={cursorVariants}
      animate={isHovering ? "hover" : "default"}
      transition={{ duration: 0.2 }}
    />
  );
};

export default CustomCursor;
