import { motion, useSpring } from "motion/react";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useChart, useChartStable } from "./chart-context";
import { hmsTimeFmt } from "./chart-formatters";

const TICKER_HALF_WIDTH = 50;
const FADE_BUFFER = 20;
const crosshairSpringConfig = { stiffness: 300, damping: 30 };

function labelFadeOpacity(
  labelX: number,
  crosshairX: number | null,
  isHovering: boolean
): number {
  if (!isHovering || crosshairX === null) return 1;
  const distance = Math.abs(labelX - crosshairX);
  if (distance < TICKER_HALF_WIDTH) return 0;
  if (distance < TICKER_HALF_WIDTH + FADE_BUFFER) {
    return (distance - TICKER_HALF_WIDTH) / FADE_BUFFER;
  }
  return 1;
}

export interface LiveXAxisProps {
  numTicks?: number;
  formatTime?: (t: number) => string;
}

const defaultFormatTime = (t: number) => hmsTimeFmt.format(new Date(t));

export function LiveXAxis(props: LiveXAxisProps) {
  const { containerRef } = useChartStable();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = containerRef.current;
  if (!(mounted && container)) return null;

  return <LiveXAxisInner {...props} container={container} />;
}

const LiveXAxisInner = memo(function LiveXAxisInner({
  numTicks = 5,
  formatTime = defaultFormatTime,
  container,
}: LiveXAxisProps & { container: HTMLDivElement }) {
  const { xScale, margin, tooltipData } = useChart();

  const domain = xScale.domain();
  const startMs = domain[0]?.getTime() ?? 0;
  const endMs = domain[1]?.getTime() ?? 0;

  const labels = useMemo(() => {
    const step = (endMs - startMs) / Math.max(1, numTicks - 1);
    return Array.from({ length: numTicks }, (_, i) => {
      const t = startMs + i * step;
      const x = (xScale(new Date(t)) ?? 0) + margin.left;
      return { x, label: formatTime(t), stableKey: i };
    });
  }, [startMs, endMs, numTicks, xScale, margin.left, formatTime]);

  const isHovering = tooltipData !== null;
  const crosshairX = tooltipData ? tooltipData.x + margin.left : null;

  const pillLabel = useMemo(() => {
    if (!tooltipData) return null;
    const timeMs = xScale.invert(tooltipData.x).getTime();
    return formatTime(timeMs);
  }, [tooltipData, xScale, formatTime]);

  const pillX = tooltipData ? tooltipData.x + margin.left : 0;
  const animatedPillX = useSpring(pillX, crosshairSpringConfig);
  const springRef = useRef(animatedPillX);
  springRef.current = animatedPillX;

  useEffect(() => {
    springRef.current.set(pillX);
  }, [pillX]);

  return createPortal(
    <div className="pointer-events-none absolute inset-0">
      {labels.map((l) => (
        <div
          className="absolute"
          key={l.stableKey}
          style={{
            left: l.x,
            bottom: 6,
            width: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <motion.span
            animate={{
              opacity: labelFadeOpacity(l.x, crosshairX, isHovering),
            }}
            className="whitespace-nowrap font-mono text-[10px] text-[#6B6B6B]"
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {l.label}
          </motion.span>
        </div>
      ))}

      {isHovering && pillLabel && (
        <motion.div
          className="absolute z-50"
          style={{
            left: animatedPillX,
            x: "-50%",
            bottom: 2,
          }}
        >
          <div className="overflow-hidden rounded-full bg-[#002449] px-3 py-0.5 text-white shadow-md">
            <span className="whitespace-nowrap font-mono font-bold text-[10px]">
              {pillLabel}
            </span>
          </div>
        </motion.div>
      )}
    </div>,
    container
  );
});

LiveXAxis.displayName = "LiveXAxis";
