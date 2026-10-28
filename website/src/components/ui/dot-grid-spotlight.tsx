"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export type DotGridSpotlightProps = {
  /**
   * The base color of the default/inactive dots.
   */
  dotColor?: string;

  /**
   * The color of the active dots when illuminated by the cursor's spotlight.
   */
  activeDotColor?: string;

  /**
   * The distance (in pixels) between each dot in the grid.
   * @default 18
   */
  spacing?: number;

  /**
   * The default radius of the dots when they are outside the interaction area.
   * @default 1.4
   */
  baseRadius?: number;

  /**
   * The maximum radius of a dot when it is at the exact center of the cursor.
   * @default 2.8
   */
  activeRadius?: number;

  /**
   * The radius (in pixels) of the interaction area (spotlight) around the cursor.
   * @default 170
   */
  interactionRadius?: number;

  /**
   * The maximum opacity (alpha) at the exact center of the spotlight.
   * @default 1.0
   */
  activeMaxAlpha?: number;

  /**
   * The minimum opacity (alpha) at the outer edge of the spotlight.
   * @default 0.35
   */
  activeMinAlpha?: number;

  /**
   * Optional CSS class name to apply to the canvas or its wrapper.
   */
  className?: string;
};

export function DotGridSpotlight({
  dotColor,
  activeDotColor,
  spacing = 18,
  baseRadius = 1.1,
  activeRadius = 1.7,
  interactionRadius = 135,
  activeMaxAlpha = 0.45,
  activeMinAlpha = 0.15,
  className,
}: DotGridSpotlightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Default to subtle center spotlight
  const mouse = useRef({ x: 512, y: 160, isActive: true });

  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let renderFrameId: number | null = null;

    const getColors = () => {
      const isDarkMode =
        typeof document !== "undefined" &&
        (document.documentElement.classList.contains("dark") ||
          resolvedTheme === "dark");

      const base =
        dotColor ??
        (isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)");
      const active =
        activeDotColor ??
        (isDarkMode ? "rgba(255, 255, 255, 0.38)" : "rgba(0, 0, 0, 0.35)");

      return { base, active };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const { base: resolvedBase, active: resolvedActive } = getColors();

      const offsetX = (width % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      for (let x = offsetX; x <= width; x += spacing) {
        for (let y = offsetY; y <= height; y += spacing) {
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let dotRad = baseRadius;
          let currentColor = resolvedBase;
          let dotAlpha = 1.0;

          if (mouse.current.isActive && distance < interactionRadius) {
            const factor = 1 - distance / interactionRadius;
            dotRad = baseRadius + (activeRadius - baseRadius) * factor;
            currentColor = resolvedActive;
            dotAlpha =
              activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * factor;
          }

          ctx.globalAlpha = dotAlpha;
          ctx.beginPath();
          ctx.arc(x, y, dotRad, 0, Math.PI * 2);
          ctx.fillStyle = currentColor;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      width = parent.clientWidth || 1024;
      height = parent.clientHeight || 400;

      if (width === 0 || height === 0) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Center initial spotlight if at initial coords
      if (mouse.current.x === 512 && mouse.current.y === 160) {
        mouse.current.x = width / 2;
        mouse.current.y = height / 2;
      }

      draw();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      };

      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(() => {
          draw();
          renderFrameId = null;
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.current.isActive = false;
      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(() => {
          draw();
          renderFrameId = null;
        });
      }
    };

    const parent = canvas.parentElement;
    const targetEl = parent || canvas;

    targetEl.addEventListener("mousemove", handleMouseMove as EventListener);
    targetEl.addEventListener("mouseleave", handleMouseLeave as EventListener);

    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (parent) resizeObserver.observe(parent);

    // Watch for DOM dark class changes to redraw instantly
    const themeObserver = new MutationObserver(() => {
      draw();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial immediate layout & draw
    resizeCanvas();
    const timer = setTimeout(resizeCanvas, 50);

    return () => {
      clearTimeout(timer);
      targetEl.removeEventListener("mousemove", handleMouseMove as EventListener);
      targetEl.removeEventListener("mouseleave", handleMouseLeave as EventListener);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      if (renderFrameId !== null) cancelAnimationFrame(renderFrameId);
    };
  }, [
    spacing,
    baseRadius,
    activeRadius,
    interactionRadius,
    dotColor,
    activeDotColor,
    activeMaxAlpha,
    activeMinAlpha,
    resolvedTheme,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={cn( "pointer-events-none absolute inset-0 block h-full w-full", className )}
    />
  );
}
