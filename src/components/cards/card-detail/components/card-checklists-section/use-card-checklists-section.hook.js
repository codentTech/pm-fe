import { useState } from "react";

export default function useCardChecklistsSection({
  onAddChecklist,
  onAddItem,
}) {
  const [showAddChecklist, setShowAddChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [addingItemFor, setAddingItemFor] = useState(null);
  const [newItemTitle, setNewItemTitle] = useState("");

  const items = (cl) =>
    [...(cl.Items || [])].sort((a, b) => (a.Position ?? 0) - (b.Position ?? 0));
  const completedCount = (cl) => items(cl).filter((i) => i.IsCompleted).length;

  const handleAddChecklist = (e) => {
    e.preventDefault();
    if (newChecklistTitle?.trim()) {
      onAddChecklist(newChecklistTitle.trim());
      setNewChecklistTitle("");
      setShowAddChecklist(false);
    }
  };

  const handleAddItem = (e, checklistId) => {
    e.preventDefault();
    if (newItemTitle?.trim()) {
      onAddItem(checklistId, newItemTitle.trim());
      setNewItemTitle("");
      setAddingItemFor(null);
    }
  };

  const handleCancelChecklist = () => {
    setShowAddChecklist(false);
    setNewChecklistTitle("");
  };

  const handleCancelItem = () => {
    setAddingItemFor(null);
    setNewItemTitle("");
  };

  return {
    showAddChecklist,
    setShowAddChecklist,
    newChecklistTitle,
    setNewChecklistTitle,
    addingItemFor,
    setAddingItemFor,
    newItemTitle,
    setNewItemTitle,
    items,
    completedCount,
    handleAddChecklist,
    handleAddItem,
    handleCancelChecklist,
    handleCancelItem,
  };
}
