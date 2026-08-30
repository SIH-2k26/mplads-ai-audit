import type { scaleLinear, scaleTime } from "@visx/scale";
import type { Transition } from "motion/react";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type RefObject,
  type SetStateAction,
  useContext,
  useMemo,
} from "react";
import type { ChartPhase, ChartStatus } from "./chart-phase";
import type { ReferenceAreaConfig } from "./reference-area-config";
import { DEFAULT_Y_AXIS_ID } from "./y-axis-scales";

type ScaleLinear<Output, _Input = number> = ReturnType<typeof scaleLinear<Output>>;
type ScaleTime<Output, _Input = Date | number> = ReturnType<typeof scaleTime<Output>>;

export const chartCssVars = {
  background: "var(--chart-background, #ffffff)",
  foreground: "var(--chart-foreground, #0E0E0E)",
  foregroundMuted: "var(--chart-foreground-muted, #6B6B6B)",
  label: "var(--chart-label, #6B6B6B)",
  linePrimary: "var(--chart-line-primary, #002449)",
  lineSecondary: "var(--chart-line-secondary, #15803D)",
  crosshair: "var(--chart-crosshair, #0E0E0E)",
  grid: "var(--chart-grid, #E5E3DC)",
  indicatorColor: "var(--chart-indicator-color, #15803D)",
};

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface TooltipData {
  point: Record<string, unknown>;
  index: number;
  x: number;
  yPositions: Record<string, number>;
  xPositions?: Record<string, number>;
}

export interface LineConfig {
  dataKey: string;
  stroke: string;
  strokeWidth: number;
  yAxisId?: string | number;
}

export interface ChartHoverContextValue {
  tooltipData: TooltipData | null;
  setTooltipData: Dispatch<SetStateAction<TooltipData | null>>;
}

export interface ChartContextValue extends ChartHoverContextValue {
  data: Record<string, unknown>[];
  renderData: Record<string, unknown>[];
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  yScales: Record<string, ScaleLinear<number, number>>;
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
  margin: Margin;
  columnWidth: number;
  containerRef: RefObject<HTMLDivElement | null>;
  lines: LineConfig[];
  referenceAreas: ReferenceAreaConfig[];
  chartPhase: ChartPhase;
  chartStatus: ChartStatus;
  isLoaded: boolean;
  animationDuration: number;
  xAccessor: (d: Record<string, unknown>) => Date;
  dateLabels: string[];
}

export type ChartStableContextValue = Omit<ChartContextValue, keyof ChartHoverContextValue>;

const ChartStableContext = createContext<ChartStableContextValue | null>(null);
const ChartHoverContext = createContext<ChartHoverContextValue | null>(null);

export function ChartProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: ChartContextValue;
}) {
  const stable = useMemo<ChartStableContextValue>(
    () => ({
      data: value.data,
      renderData: value.renderData,
      xScale: value.xScale,
      yScale: value.yScale,
      yScales: value.yScales,
      width: value.width,
      height: value.height,
      innerWidth: value.innerWidth,
      innerHeight: value.innerHeight,
      margin: value.margin,
      columnWidth: value.columnWidth,
      containerRef: value.containerRef,
      lines: value.lines,
      referenceAreas: value.referenceAreas,
      chartPhase: value.chartPhase,
      chartStatus: value.chartStatus,
      isLoaded: value.isLoaded,
      animationDuration: value.animationDuration,
      xAccessor: value.xAccessor,
      dateLabels: value.dateLabels,
    }),
    [
      value.data,
      value.renderData,
      value.xScale,
      value.yScale,
      value.yScales,
      value.width,
      value.height,
      value.innerWidth,
      value.innerHeight,
      value.margin,
      value.columnWidth,
      value.containerRef,
      value.lines,
      value.referenceAreas,
      value.chartPhase,
      value.chartStatus,
      value.isLoaded,
      value.animationDuration,
      value.xAccessor,
      value.dateLabels,
    ]
  );

  const hover = useMemo<ChartHoverContextValue>(
    () => ({
      tooltipData: value.tooltipData,
      setTooltipData: value.setTooltipData,
    }),
    [value.tooltipData, value.setTooltipData]
  );

  return (
    <ChartStableContext.Provider value={stable}>
      <ChartHoverContext.Provider value={hover}>
        {children}
      </ChartHoverContext.Provider>
    </ChartStableContext.Provider>
  );
}

export function useChartStable(): ChartStableContextValue {
  const context = useContext(ChartStableContext);
  if (!context) {
    throw new Error("useChartStable must be used within a ChartProvider.");
  }
  return context;
}

export function useChartHover(): ChartHoverContextValue {
  const context = useContext(ChartHoverContext);
  if (!context) {
    throw new Error("useChartHover must be used within a ChartProvider.");
  }
  return context;
}

export function useChart(): ChartContextValue {
  const stable = useChartStable();
  const hover = useChartHover();
  return { ...stable, ...hover };
}

export default ChartStableContext;
