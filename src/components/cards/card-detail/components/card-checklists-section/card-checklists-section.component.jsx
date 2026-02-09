"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import useCardChecklistsSection from "./use-card-checklists-section.hook";

function CardChecklistsSection({
  checklists,
  onAddChecklist,
  onAddItem,
  onToggleItem,
  onDeleteChecklist,
  onDeleteItem,
}) {
  const {
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
  } = useCardChecklistsSection({ onAddChecklist, onAddItem });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="min-w-0 flex-1 flex items-center gap-2 typography-body font-semibold text-indigo-600">
          <CheckSquare className="h-4 w-4 shrink-0" />
          <span className="truncate">Checklists</span>
        </h4>
        {!showAddChecklist && (
          <button
            type="button"
            onClick={() => setShowAddChecklist(true)}
            className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Add checklist"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      {showAddChecklist && (
        <div className="flex gap-2 rounded-md bg-neutral-50 p-4">
          <CustomInput
            name="title"
            placeholder="Checklist title"
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            className="flex-1"
          />
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              size="sm"
              onClick={handleCancelChecklist}
            />
            <CustomButton
              type="button"
              text="Add"
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleAddChecklist(e);
              }}
            />
          </div>
        </div>
      )}
      {checklists?.map((cl) => (
        <div key={cl.Id} className="rounded-md bg-neutral-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-medium text-neutral-800">
              {cl.Title} ({completedCount(cl)}/{items(cl).length})
            </span>
            <CustomButton
              variant="ghost"
              size="sm"
              text=" "
              startIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => onDeleteChecklist(cl.Id)}
              className="!p-1 text-neutral-400 hover:bg-danger-50 hover:text-danger-600 [&_.btn]:!p-1"
            />
          </div>
          <ul className="space-y-1">
            {items(cl).map((item) => (
              <li key={item.Id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!item.IsCompleted}
                  onChange={() =>
                    onToggleItem(cl.Id, item.Id, !item.IsCompleted)
                  }
                  className="h-4 w-4 rounded border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                />
                <span
                  className={
                    item.IsCompleted
                      ? "typography-body text-neutral-500 line-through"
                      : "typography-body text-neutral-800"
                  }
                >
                  {item.Title}
                </span>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  text=" "
                  startIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => onDeleteItem(cl.Id, item.Id)}
                  className="!p-1 ml-auto text-neutral-400 hover:bg-danger-50 hover:text-danger-600 [&_.btn]:!p-1"
                />
              </li>
            ))}
          </ul>
          {addingItemFor === cl.Id ? (
            <div className="mt-2 flex gap-2">
              <CustomInput
                name="itemTitle"
                placeholder="Add an item"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                className="flex-1"
              />
              <div className="flex justify-end gap-2">
                <CustomButton
                  type="button"
                  text="Cancel"
                  variant="cancel"
                  size="sm"
                  onClick={handleCancelItem}
                />
                <CustomButton
                  type="button"
                  text="Add"
                  variant="primary"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddItem(e, cl.Id);
                  }}
                />
              </div>
            </div>
          ) : (
            <CustomButton
              text="Add an item"
              variant="ghost"
              size="sm"
              onClick={() => setAddingItemFor(cl.Id)}
              className="mt-2 !p-0 typography-body-sm text-neutral-500 hover:text-neutral-700"
            />
          )}
        </div>
      ))}
    </div>
  );
}

CardChecklistsSection.propTypes = {
  checklists: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      Title: PropTypes.string.isRequired,
      Items: PropTypes.arrayOf(
        PropTypes.shape({
          Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
          Title: PropTypes.string.isRequired,
          IsCompleted: PropTypes.bool,
          Position: PropTypes.number,
        })
      ),
    })
  ),
  onAddChecklist: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onToggleItem: PropTypes.func.isRequired,
  onDeleteChecklist: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default CardChecklistsSection;
