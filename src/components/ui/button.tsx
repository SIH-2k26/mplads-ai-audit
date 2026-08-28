import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[4px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#18324A] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#18324A] text-white hover:bg-[#102A43] active:bg-[#0c2033] shadow-subtle border border-[#102A43]",
        secondary:
          "bg-[#EDE8DE] text-[#18324A] hover:bg-[#e2dbcd] active:bg-[#d5ccba] border border-[#D9D5CC]",
        outline:
          "border border-[#D9D5CC] bg-white text-[#1D2939] hover:bg-[#F7F5F0] hover:border-[#98A2B3]",
        saffron:
          "bg-[#C98219] text-white hover:bg-[#b07115] active:bg-[#996212] shadow-subtle border border-[#b07115]",
        critical:
          "bg-[#B44343] text-white hover:bg-[#993939] active:bg-[#803030] shadow-subtle border border-[#993939]",
        ghost:
          "text-[#1D2939] hover:bg-[#EDE8DE]/60 hover:text-[#18324A]",
        link:
          "text-[#18324A] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[3px] px-3 text-xs",
        lg: "h-11 rounded-[4px] px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
