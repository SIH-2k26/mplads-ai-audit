import { cn } from "../../lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-[3px] bg-[#EDE8DE]", className)}
      {...props}
    />
  );
}

export { Skeleton };
