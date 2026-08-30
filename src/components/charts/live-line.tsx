import { curveMonotoneX } from "@visx/curve";
import { AreaClosed, LinePath } from "@visx/shape";
import { motion } from "motion/react";
import { useCallback, useId, useMemo } from "react";
import { chartCssVars, useChart } from "./chart-context";

export type Momentum = "up" | "down" | "flat";

export interface MomentumColors {
  up: string;
  down: string;
  flat: string;
}

export function detectMomentum(
  data: Record<string, unknown>[],
  dataKey: string,
  lookback = 20
): Momentum {
  if (data.length < 5) return "flat";
  const start = Math.max(0, data.length - lookback);
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let i = start; i < data.length; i++) {
    const v = data[i]?.[dataKey];
    if (typeof v === "number") {
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }
  const range = max - min;
  if (range === 0) return "flat";
  const tailStart = Math.max(start, data.length - 5);
  const first = (data[tailStart]?.[dataKey] as number) ?? 0;
  const last = (data.at(-1)?.[dataKey] as number) ?? 0;
  const delta = last - first;
  const threshold = range * 0.12;
  if (delta > threshold) return "up";
  if (delta < -threshold) return "down";
  return "flat";
}

export interface LiveLineProps {
  dataKey: string;
  stroke?: string;
  strokeWidth?: number;
  curve?: any;
  fill?: boolean;
  pulse?: boolean;
  dotSize?: number;
  badge?: boolean;
  formatValue?: (v: number) => string;
  momentumColors?: MomentumColors;
}

export function LiveLine({
  dataKey,
  stroke = "#002449",
  strokeWidth = 2.5,
  curve = curveMonotoneX,
  fill = true,
  pulse = true,
  dotSize = 4,
  badge = true,
  formatValue = (v: number) => v.toFixed(2),
  momentumColors,
}: LiveLineProps) {
  const {
    data,
    xScale,
    yScale,
    innerWidth,
    innerHeight,
    xAccessor,
    lines,
    tooltipData,
  } = useChart();

  const isScrubbing = tooltipData !== null;
  const uid = useId();
  const gradientId = "live-line-grad-" + uid.replace(/:/g, "-");
  const areaGradientId = "live-area-grad-" + uid.replace(/:/g, "-");
  const fadeId = "live-fade-" + uid.replace(/:/g, "-");
  const fadeMaskId = "live-fade-mask-" + uid.replace(/:/g, "-");

  const getX = useCallback(
    (d: Record<string, unknown>) => xScale(xAccessor(d)) ?? 0,
    [xScale, xAccessor]
  );

  const getY = useCallback(
    (d: Record<string, unknown>) => {
      const v = d[dataKey];
      return typeof v === "number" ? (yScale(v) ?? 0) : 0;
    },
    [dataKey, yScale]
  );

  const nowPoint = data.length >= 2 ? data.at(-2) : data.at(-1);
  const liveValue =
    nowPoint && typeof nowPoint[dataKey] === "number"
      ? (nowPoint[dataKey] as number)
      : 0;

  const liveDotX = nowPoint ? (xScale(xAccessor(nowPoint)) ?? 0) : innerWidth;
  const liveDotY = yScale(liveValue) ?? 0;

  const momentum = useMemo(
    () => detectMomentum(data, dataKey),
    [data, dataKey]
  );

  const defaultMomentumColors: MomentumColors = {
    up: "#EF4444",
    down: "#15803D",
    flat: stroke,
  };
  const dotMomentumColors = momentumColors ?? defaultMomentumColors;
  const dotColor = dotMomentumColors[momentum];

  const lineConfig = lines.find((l) => l.dataKey === dataKey);
  const baseStroke = lineConfig?.stroke ?? stroke;
  const resolvedStroke = momentumColors ? momentumColors[momentum] : baseStroke;

  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={resolvedStroke} stopOpacity={1} />
          <stop offset="100%" stopColor={resolvedStroke} stopOpacity={0.8} />
        </linearGradient>
        <linearGradient id={areaGradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={resolvedStroke} stopOpacity={0.15} />
          <stop offset="100%" stopColor={resolvedStroke} stopOpacity={0.0} />
        </linearGradient>
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity={0} />
          <stop offset="4%" stopColor="white" stopOpacity={1} />
          {liveDotX < innerWidth - 1 ? (
            <>
              <stop
                offset={String((liveDotX / innerWidth) * 100) + "%"}
                stopColor="white"
                stopOpacity={1}
              />
              <stop offset="100%" stopColor="white" stopOpacity={0} />
            </>
          ) : (
            <stop offset="100%" stopColor="white" stopOpacity={1} />
          )}
        </linearGradient>
        <mask id={fadeMaskId}>
          <rect
            fill={"url(#" + fadeId + ")"}
            height={innerHeight + 40}
            width={innerWidth}
            x={0}
            y={-20}
          />
        </mask>
      </defs>

      {/* Area fill */}
      {fill && data.length > 1 && (
        <g mask={"url(#" + fadeMaskId + ")"}>
          <AreaClosed
            curve={curve}
            data={data}
            fill={"url(#" + areaGradientId + ")"}
            strokeWidth={0}
            x={getX}
            y={getY}
            yScale={yScale}
          />
        </g>
      )}

      {/* Line */}
      {data.length > 1 && (
        <g mask={"url(#" + fadeMaskId + ")"}>
          <LinePath
            curve={curve}
            data={data}
            stroke={"url(#" + gradientId + ")"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={strokeWidth}
            x={getX}
            y={getY}
          />
        </g>
      )}

      {/* Dashed horizontal line at current value */}
      <line
        opacity={0.2}
        stroke={resolvedStroke}
        strokeDasharray="4,4"
        strokeWidth={1}
        x1={0}
        x2={innerWidth}
        y1={liveDotY}
        y2={liveDotY}
      />

      {/* Live indicator */}
      <motion.g
        animate={{ opacity: isScrubbing ? 0.25 : 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <g>
          {pulse && (
            <circle
              cx={liveDotX}
              cy={liveDotY}
              fill="none"
              opacity={0.4}
              r={dotSize * 2}
              stroke={dotColor}
              strokeWidth={1.5}
            >
              <animate
                attributeName="r"
                dur="1.5s"
                from={String(dotSize)}
                repeatCount="indefinite"
                to={String(dotSize * 3.5)}
              />
              <animate
                attributeName="opacity"
                dur="1.5s"
                from="0.5"
                repeatCount="indefinite"
                to="0"
              />
            </circle>
          )}
          <circle
            cx={liveDotX}
            cy={liveDotY}
            fill={dotColor}
            opacity={0.15}
            r={dotSize + 2}
          />
          <circle
            cx={liveDotX}
            cy={liveDotY}
            fill={dotColor}
            r={dotSize}
            stroke="#ffffff"
            strokeWidth={2}
          />
        </g>

        {badge && (
          <g transform={"translate(" + (liveDotX + 10) + "," + liveDotY + ")"}>
            <rect
              fill="#002449"
              height={22}
              opacity={0.95}
              rx={5}
              width={formatValue(liveValue).length * 7.5 + 14}
              x={0}
              y={-11}
            />
            <text
              fill="#ffffff"
              fontFamily="monospace"
              fontSize={10}
              fontWeight={700}
              x={7}
              y={4}
            >
              {formatValue(liveValue)}
            </text>
          </g>
        )}
      </motion.g>
    </>
  );
}

LiveLine.displayName = "LiveLine";
