"use client";

import { useEffect, useRef } from "react";

export default function useInlineEditInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleKeyDown(e, onSave, onCancel) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  return { inputRef, handleKeyDown };
}
