import React, {
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import "./villageHome.css";

export function VillageButton({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      type={type}
      className={`village-button village-button--${variant} ${
        variant === "primary" ? "home-preview-play" : "home-preview-secondary"
      } ${className}`}
      {...props}
    />
  );
}
export function VillageCard({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={`village-card ${className}`} {...props} />;
}
export function VillageProgress({
  label,
  value,
  max,
}: {
  label: string;
  value: number;
  max: number;
}) {
  return (
    <progress
      className="village-progress"
      aria-label={label}
      value={value}
      max={max}
    />
  );
}
