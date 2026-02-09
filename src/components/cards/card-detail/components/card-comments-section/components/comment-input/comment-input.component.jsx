"use client";

import PropTypes from "prop-types";
import MentionDropdown from "../mention-dropdown/mention-dropdown.component";
import useCommentInput from "./use-comment-input.hook";

function CommentInput({ value, onChange, placeholder, orgMembers, onKeyDown }) {
  const {
    textareaRef,
    showMentionDropdown,
    displayMembers,
    selectedIndex,
    insertMention,
    handleChange,
    handleKeyDown,
  } = useCommentInput(value, onChange, orgMembers);

  const handleKeyDownWithPassthrough = (e) => {
    handleKeyDown(e);
    if (!e.defaultPrevented) onKeyDown?.(e);
  };

  return (
    <div className="relative">
      {showMentionDropdown && (
        <div className="absolute bottom-full left-0 z-50 mb-1">
          <MentionDropdown
            members={displayMembers}
            selectedIndex={selectedIndex}
            onSelect={insertMention}
          />
        </div>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDownWithPassthrough}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-md border border-neutral-200 px-3 py-2 typography-body text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-0"
      />
    </div>
  );
}

CommentInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  orgMembers: PropTypes.arrayOf(
    PropTypes.shape({
      User: PropTypes.shape({
        Id: PropTypes.string,
        FullName: PropTypes.string,
      }),
      UserId: PropTypes.string,
    })
  ),
  onKeyDown: PropTypes.func,
};

export default CommentInput;
