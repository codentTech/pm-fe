"use client";

import { useState, useCallback } from "react";

export default function useListColumn(list) {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardDueDate, setCardDueDate] = useState("");
  const [showMenu, setShowMenu] = useState(null);
  const cards = [...(list?.Cards || [])].sort(
    (a, b) => (a.Position ?? 0) - (b.Position ?? 0)
  );

  const resetCardForm = useCallback(() => {
    setCardTitle("");
    setCardDescription("");
    setCardDueDate("");
  }, []);

  return {
    cardTitle,
    setCardTitle,
    cardDescription,
    setCardDescription,
    cardDueDate,
    setCardDueDate,
    showMenu,
    setShowMenu,
    cards,
    resetCardForm,
  };
}
