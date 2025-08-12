
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  const cursorDotX = useMotionValue(-100);
  const cursorDotY = useMotionValue(-100);
  
  const cursorRingX = useMotionValue(-100);
  const cursorRingY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 500 };
  const cursorDotXSpring = useSpring(cursorDotX, springConfig);
  const cursorDotYSpring = useSpring(cursorDotY, springConfig);
  
  const cursorRingXSpring = useSpring(cursorRingX, springConfig);
  const cursorRingYSpring = useSpring(cursorRingY, springConfig);


  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorDotX.set(e.clientX);
      cursorDotY.set(e.clientY);
      cursorRingX.set(e.clientX);
      cursorRingY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
            setIsHovering(true);
        }
    };
    
    const handleMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
            setIsHovering(false);
        }
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [cursorDotX, cursorDotY, cursorRingX, cursorRingY]);

  return (
    <>
       <motion.div
        className="cursor-ring"
        style={{
          translateX: cursorRingXSpring,
          translateY: cursorRingYSpring,
        }}
         animate={{
            scale: isHovering ? 1.5 : 1,
            opacity: isHovering ? 0.7 : 1
        }}
        transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
        }}
      />
      <motion.div
        className="cursor-dot"
        style={{
          translateX: cursorDotXSpring,
          translateY: cursorDotYSpring,
        }}
      />
    </>
  );
};

export default CustomCursor;
