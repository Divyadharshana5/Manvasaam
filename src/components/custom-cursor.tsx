
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 500 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  const innerX = useMotionValue(-100);
  const innerY = useMotionValue(-100);
  
  const innerSpringConfig = { damping: 30, stiffness: 700 };
  const innerXSpring = useSpring(innerX, innerSpringConfig);
  const innerYSpring = useSpring(innerY, innerSpringConfig);


  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      innerX.set(e.clientX);
      innerY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button');
        setIsHovering(isInteractive);
    };
    
    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", () => setIsHovering(false), { passive: true });


    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", () => setIsHovering(false));
    };
  }, [cursorX, cursorY, innerX, innerY]);

  return (
    <>
        <motion.div
        className={cn(
            "custom-cursor-inner",
        )}
        style={{
            translateX: innerXSpring,
            translateY: innerYSpring,
        }}
        />
        <motion.div
        className={cn(
            "custom-cursor-outer",
            isHovering && "hovering"
        )}
        style={{
            translateX: cursorXSpring,
            translateY: cursorYSpring,
        }}
        />
    </>
  );
};

export default CustomCursor;
