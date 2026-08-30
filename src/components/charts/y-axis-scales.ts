import { scaleLinear } from "@visx/scale";
import type { LineConfig } from "./chart-context";

export const DEFAULT_Y_AXIS_ID = "left";
export type YAxisOrientation = "left" | "right";

export function normalizeYAxisId(id?: string | number): string {
  if (id == null || id === "") {
    return DEFAULT_Y_AXIS_ID;
  }
  return String(id);
}

export function groupLinesByYAxisId(
  lines: LineConfig[]
): Map<string, LineConfig[]> {
  const groups = new Map<string, LineConfig[]>();
  for (const line of lines) {
    const axisId = normalizeYAxisId(line.yAxisId);
    const bucket = groups.get(axisId) ?? [];
    bucket.push(line);
    groups.set(axisId, bucket);
  }
  return groups;
}

type YScale = ReturnType<typeof scaleLinear<number>>;

export function wrapSingleYScale(yScale: YScale): Record<string, YScale> {
  return { [DEFAULT_Y_AXIS_ID]: yScale };
}
