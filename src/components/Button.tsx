import React from "react";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "disabled";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const variantStyles = {
    primary: disabled 
      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
      : "bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:shadow-lg hover:scale-105 focus:ring-amber-500",
    secondary: disabled
      ? "bg-slate-600 text-slate-400 cursor-not-allowed border border-slate-600"
      : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700 focus:ring-slate-500",
    success: disabled
      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
      : "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: disabled
      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
      : "bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 focus:ring-red-500",
    disabled: "bg-slate-600 text-slate-400 cursor-not-allowed"
  };

  const widthStyles = fullWidth ? "w-full" : "";

  const finalVariant = disabled ? "disabled" : variant;

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[finalVariant]} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;