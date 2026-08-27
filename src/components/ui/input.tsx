import * as React from "react";
import { cn } from "../../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-[4px] border border-[#D9D5CC] bg-white px-3 py-1 text-sm shadow-subtle transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#98A2B3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#18324A] focus-visible:border-[#18324A] disabled:cursor-not-allowed disabled:opacity-50 text-[#1D2939]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
