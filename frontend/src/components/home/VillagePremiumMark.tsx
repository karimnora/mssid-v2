import React from "react";
import { LockKeyhole } from "lucide-react";
import { PremiumOffer } from "../PremiumOffer";
import "./villageTokens.css";

/** Visual entitlement mark only. The caller still owns all access checks. */
export function VillagePremiumMark({ locked = false }: { locked?: boolean }) {
  return (
    <span className="village-theme village-premium-mark">
      <span className="village-premium-icon" aria-hidden="true">
        {locked ? <LockKeyhole size={20} /> : "✦"}
      </span>
      مع العائلة المميّزة
    </span>
  );
}
/** Reuses the existing parent gate and offer instead of introducing a second checkout. */
export function VillageFamilyOffer() {
  return (
    <div className="village-theme">
      <VillagePremiumMark />
      <PremiumOffer />
    </div>
  );
}
