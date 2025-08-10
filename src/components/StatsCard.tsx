import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor?: string;
  valueColor?: string;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  value,
  label,
  iconColor = "text-amber-400",
  valueColor = "text-amber-400",
  className = ""
}) => {
  return (
    <div className={`bg-slate-800/40 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 text-center ${className}`}>
      <Icon className={`w-10 h-10 ${iconColor} mx-auto mb-3`} />
      <div className={`text-3xl font-bold ${valueColor} mb-1`}>{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
};

export default StatsCard;