import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[12px] border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none select-none tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#0E0E0E] text-white",
        secondary:
          "border-[#E5E3DC] bg-[#EAE8E2] text-[#0E0E0E]",
        outline:
          "border-[#E5E3DC] text-[#0E0E0E] bg-white",
        success:
          "border-[#2F7658]/30 bg-[#2F7658]/10 text-[#2F7658]",
        warning:
          "border-[#B7791F]/30 bg-[#B7791F]/10 text-[#B7791F]",
        critical:
          "border-[#B44343]/30 bg-[#B44343]/10 text-[#B44343]",
        saffron:
          "border-[#9FE870]/40 bg-[#9FE870]/20 text-[#0E0E0E]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
