import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-[3px] border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none select-none tracking-wide",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#18324A] text-white",
        secondary:
          "border-[#D9D5CC] bg-[#EDE8DE] text-[#18324A]",
        outline:
          "border-[#D9D5CC] text-[#1D2939] bg-white",
        success:
          "border-[#2F7658]/30 bg-[#2F7658]/10 text-[#2F7658] font-semibold",
        warning:
          "border-[#B7791F]/30 bg-[#B7791F]/10 text-[#B7791F] font-semibold",
        critical:
          "border-[#B44343]/30 bg-[#B44343]/10 text-[#B44343] font-semibold",
        saffron:
          "border-[#C98219]/30 bg-[#C98219]/10 text-[#C98219] font-semibold",
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
