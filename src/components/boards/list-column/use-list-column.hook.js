"use client";

import { useState, useCallback, useMemo } from "react";

export default function useListColumn(list, onSaveCard, onCancelCard) {
  const [cardTitle, setCardTitle] = useState("");
  const [cardDescription, setCardDescription] = useState("");
  const [cardDueDate, setCardDueDate] = useState("");
  const [showMenu, setShowMenu] = useState(null);

  const cards = useMemo(
    () =>
      [...(list?.Cards || [])].sort(
        (a, b) => (a.Position ?? 0) - (b.Position ?? 0),
      ),
    [list?.Cards],
  );

  const resetCardForm = useCallback(() => {
    setCardTitle("");
    setCardDescription("");
    setCardDueDate("");
  }, []);

  const handleSaveCard = useCallback(() => {
    if (!cardTitle?.trim()) return;
    onSaveCard?.({
      Title: cardTitle.trim(),
      Description: cardDescription?.trim() || undefined,
      DueDate: cardDueDate || undefined,
    });
    resetCardForm();
  }, [cardTitle, cardDescription, cardDueDate, onSaveCard, resetCardForm]);

  const handleCardFormKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSaveCard();
      }
      if (e.key === "Escape") {
        resetCardForm();
        onCancelCard?.();
      }
    },
    [handleSaveCard, resetCardForm, onCancelCard],
  );

  const handleCancelCard = useCallback(() => {
    resetCardForm();
    onCancelCard?.();
  }, [resetCardForm, onCancelCard]);

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
    handleSaveCard,
    handleCardFormKeyDown,
    handleCancelCard,
  };
}
