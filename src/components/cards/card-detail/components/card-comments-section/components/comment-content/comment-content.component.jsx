"use client";

import PropTypes from "prop-types";
import useCommentContent from "./use-comment-content.hook";

function CommentContent({ content, orgMembers }) {
  const parts = useCommentContent(content, orgMembers);

  if (!content) return null;

  return (
    <p className="typography-body text-neutral-800">
      {parts.map((part, i) =>
        part.startsWith("@") ? (
          <span key={i} className="font-medium text-indigo-600">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

CommentContent.propTypes = {
  content: PropTypes.string,
  orgMembers: PropTypes.arrayOf(
    PropTypes.shape({
      User: PropTypes.shape({ FullName: PropTypes.string }),
    })
  ),
};

export default CommentContent;
