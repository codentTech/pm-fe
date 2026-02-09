"use client";

import PropTypes from "prop-types";
import useMentionDropdown from "./use-mention-dropdown.hook";

function MentionDropdown({ members, selectedIndex, onSelect }) {
  useMentionDropdown();

  if (members.length === 0) {
    return (
      <div className="max-h-40 w-64 overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
        <p className="px-3 py-2 typography-caption text-neutral-500">
          No members found
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-40 w-64 overflow-y-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg">
      {members.map((m, i) => (
        <button
          key={m.User?.Id || m.UserId}
          type="button"
          onClick={() => onSelect(m)}
          className={`flex w-full items-center gap-2 px-3 py-2 text-left typography-body text-neutral-800 hover:bg-indigo-50 ${
            i === selectedIndex ? "bg-indigo-50" : ""
          }`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 typography-caption font-medium text-indigo-700">
            {(m.User?.FullName || "?")[0]}
          </span>
          {m.User?.FullName || "Unknown"}
        </button>
      ))}
    </div>
  );
}

MentionDropdown.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      User: PropTypes.shape({
        Id: PropTypes.string,
        FullName: PropTypes.string,
      }),
      UserId: PropTypes.string,
    })
  ).isRequired,
  selectedIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default MentionDropdown;
