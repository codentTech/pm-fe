"use client";

import { useState } from "react";

export default function useCardItem() {
  // stats
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  return {
    showMoveMenu,
    setShowMoveMenu,
  };
}
