
"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const velocityX = useMotionValue(0);
  const velocityY = useMotionValue(0);

  const lastPos = useRef({ x: -100, y: -100 });

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  const rotateX = useTransform(velocityY, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(velocityX, [-0.5, 0.5], ["-15deg", "15deg"]);
  

  useEffect(() => {
    let animationFrameId: number;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const updateVelocity = () => {
      const newX = cursorX.get();
      const newY = cursorY.get();

      const deltaX = newX - lastPos.current.x;
      const deltaY = newY - lastPos.current.y;

      velocityX.set(Math.min(Math.max(deltaX / 10, -0.5), 0.5));
      velocityY.set(Math.min(Math.max(deltaY / 10, -0.5), 0.5));
      
      lastPos.current = { x: newX, y: newY };
      
      animationFrameId = requestAnimationFrame(updateVelocity);
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
    animationFrameId = requestAnimationFrame(updateVelocity);


    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorX, cursorY, velocityX, velocityY]);

  return (
    <motion.div
      className="custom-cursor-container"
    >
      <motion.div
        className="custom-cursor"
        style={{
          translateX: springX,
          translateY: springY,
          rotateX: isHovering ? "0deg" : rotateX,
          rotateY: isHovering ? "0deg" : rotateY,
        }}
        animate={{
          width: isHovering ? 50 : 25,
          height: isHovering ? 50 : 25,
          borderWidth: isHovering ? '2px' : '0px',
          backgroundColor: isHovering ? 'hsla(var(--primary), 0.1)' : 'hsla(var(--primary), 0.8)',
          boxShadow: isHovering ? '0 0 20px 5px hsla(var(--primary), 0.3)' : '0 0 15px 2px hsla(var(--primary), 0.5)',
        }}
        transition={{ type: 'spring', damping: 15, stiffness: 200, mass: 0.2 }}
      />
    </motion.div>
  );
};

export default CustomCursor;
