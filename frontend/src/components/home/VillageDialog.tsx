import "./villageHome.css";
import React, { type ReactNode } from "react";
import { X } from "lucide-react";
import { useFocusTrap } from "../../hooks/useFocusTrap";

export function VillageDialog({
  titleId,
  className = "",
  onClose,
  children,
}: {
  titleId: string;
  className?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useFocusTrap<HTMLElement>(true, onClose);
  return (
    <div className="home-preview-overlay" onClick={onClose}>
      <section
        ref={ref}
        className={`home-preview-door ${className}`}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="home-preview-close"
          aria-label="إغلاق"
          onClick={onClose}
        >
          <X />
        </button>
        {children}
      </section>
    </div>
  );
}
