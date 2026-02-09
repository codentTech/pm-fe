import { useCallback, useEffect, useRef, useState } from "react";

export default function useCommentInput(value, onChange, orgMembers) {
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionFilter, setMentionFilter] = useState("");
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef(null);

  const filteredMembers =
    orgMembers?.filter((m) => {
      const name = (m.User?.FullName || "Unknown").toLowerCase();
      const filter = mentionFilter.toLowerCase();
      return filter ? name.includes(filter) : true;
    }) || [];

  const displayMembers = filteredMembers.slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
  }, [mentionFilter, filteredMembers.length]);

  const insertMention = useCallback(
    (member) => {
      const name = member.User?.FullName || "Unknown";
      const mention = `@${name} `;
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = mentionStartIndex;
      const end = textarea.selectionStart;
      const before = value.slice(0, start);
      const after = value.slice(end);
      const newValue = before + mention + after;
      onChange({ target: { value: newValue } });
      setShowMentionDropdown(false);
      setMentionFilter("");
      setMentionStartIndex(-1);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          before.length + mention.length,
          before.length + mention.length
        );
      }, 0);
    },
    [value, onChange, mentionStartIndex]
  );

  const handleChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      const cursorPos = e.target.selectionStart;
      onChange(e);

      const textBeforeCursor = newValue.slice(0, cursorPos);
      const lastAtIndex = textBeforeCursor.lastIndexOf("@");

      if (lastAtIndex !== -1) {
        const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
        if (!/\s/.test(textAfterAt)) {
          setShowMentionDropdown(true);
          setMentionFilter(textAfterAt);
          setMentionStartIndex(lastAtIndex);
          return;
        }
      }
      setShowMentionDropdown(false);
      setMentionFilter("");
      setMentionStartIndex(-1);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (showMentionDropdown && displayMembers.length > 0) {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "Enter" ||
          e.key === "Escape"
        ) {
          e.preventDefault();
          if (e.key === "Escape") {
            setShowMentionDropdown(false);
            return;
          }
          if (e.key === "ArrowDown") {
            setSelectedIndex((i) =>
              Math.min(i + 1, displayMembers.length - 1)
            );
            return;
          }
          if (e.key === "ArrowUp") {
            setSelectedIndex((i) => Math.max(i - 1, 0));
            return;
          }
          if (e.key === "Enter") {
            insertMention(displayMembers[selectedIndex]);
            return;
          }
        }
      }
    },
    [showMentionDropdown, displayMembers, selectedIndex, insertMention]
  );

  return {
    textareaRef,
    showMentionDropdown,
    displayMembers,
    selectedIndex,
    insertMention,
    handleChange,
    handleKeyDown,
  };
}
