
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

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const isInteractive = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button');
        setIsHovering(isInteractive);
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
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="custom-leaf-cursor"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
      animate={{
        rotate: isHovering ? 15 : 0,
        scale: isHovering ? 1.2 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-full w-full"
      >
        <path d="M12.9,2.62a1,1,0,0,0-1.8,0L4.35,14.08A8,8,0,1,0,18.1,9.31l-4.1-6.2A1,1,0,0,0,12.9,2.62Z" />
      </svg>
    </motion.div>
  );
};

export default CustomCursor;
