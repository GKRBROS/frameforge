"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the properties for the ProductHighlightCard component
interface ProductHighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  categoryIcon: React.ReactNode;
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const ProductHighlightCard = React.forwardRef<HTMLDivElement, ProductHighlightCardProps>(
  ({ className, categoryIcon, category, title, description, imageSrc, imageAlt, ...props }, ref) => {
    
    // --- Animation Logic for 3D Tilt Effect ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }: React.MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      mouseX.set(x);
      mouseY.set(y);
    };

    // Transform mouse position into a rotation value
    const rotateX = useTransform(mouseY, [0, 350], [10, -10]);
    const rotateY = useTransform(mouseX, [0, 350], [-10, 10]);
    
    // Apply spring physics for a smoother animation
    const springConfig = { stiffness: 300, damping: 20 };
    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);
    
    // --- Animation Logic for Glow Effect ---
    const glowX = useTransform(mouseX, [0, 350], [0, 100]);
    const glowY = useTransform(mouseY, [0, 350], [0, 100]);
    const glowOpacity = useTransform(mouseX, [0, 350], [0, 0.5]);

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(175); // Center
          mouseY.set(175); // Center
        }}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative h-[350px] w-full max-w-[350px] rounded-2xl bg-[#FF4500] border border-black/10 shadow-lg transition-shadow duration-300 hover:shadow-2xl overflow-hidden group",
          className
        )}
        {...props}
      >
        <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="absolute inset-4 rounded-xl bg-black/5 shadow-inner">
          
          {/* Diagonal line texture */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

          {/* Glow effect that follows the mouse */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              opacity: glowOpacity,
              background: `radial-gradient(80px at ${glowX}% ${glowY}%, rgba(0,0,0,0.1), transparent 40%)`,
            }}
          />

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-center space-x-2 text-black/60 font-medium">
              {categoryIcon}
              <span className="text-sm">{category}</span>
            </div>
            
            <div className="text-black">
              <h2 className="text-4xl font-bold tracking-tight mb-2 leading-tight">{title}</h2>
              <p className="max-w-[70%] text-xs text-black/70 font-medium leading-relaxed">
                {description}
              </p>
            </div>
          </div>
          
          {/* Product Image */}
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            style={{ transform: "translateZ(60px)" }}
            whileHover={{ scale: 1.15, y: -20, x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute -right-8 -bottom-8 h-48 w-48 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          />
        </div>
      </motion.div>
    );
  }
);

ProductHighlightCard.displayName = "ProductHighlightCard";
