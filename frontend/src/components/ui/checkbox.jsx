import React from "react";

const Checkbox = React.forwardRef(({ className = "", onChange, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={`h-4 w-4 rounded border border-gray-300 text-primary 
        focus:ring-2 focus:ring-primary focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onChange={onChange}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };