"use client";

import { Reply, User } from "lucide-react";
import PropTypes from "prop-types";
import CommentContent from "../comment-content/comment-content.component";
import ReplyForm from "../reply-form/reply-form.component";
import useCommentItem from "./use-comment-item.hook";

function CommentItem({
  comment,
  replyingToId,
  content,
  setContent,
  onReply,
  onSubmitReply,
  onCancelReply,
  orgMembers,
  isReply = false,
}) {
  const { isReplying } = useCommentItem(comment, replyingToId);

  return (
    <li className={isReply ? "ml-6 border-l-2 border-neutral-200 pl-4" : ""}>
      <div className="flex gap-3 rounded-md bg-neutral-50 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <User className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <CommentContent content={comment.Content} orgMembers={orgMembers} />
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="typography-caption text-neutral-500">
            {comment.User?.FullName || "Unknown"} •{" "}
            {comment.CreatedAt
              ? new Date(comment.CreatedAt).toLocaleDateString()
              : ""}
          </span>
          {!isReply && (
            <button
              type="button"
              onClick={() => onReply(comment.Id)}
              className="inline-flex items-center gap-1 typography-caption font-medium text-indigo-600 hover:text-indigo-700"
            >
              <Reply className="h-3 w-3" />
              Reply
            </button>
          )}
          </div>
        </div>
      </div>
      {isReplying && (
        <ReplyForm
          content={content}
          setContent={setContent}
          orgMembers={orgMembers}
          onSubmit={(e) => onSubmitReply(e, comment.Id)}
          onCancel={onCancelReply}
        />
      )}
      {comment.replies?.length > 0 && (
        <ul className="mt-2 space-y-2">
          {comment.replies.map((r) => (
            <CommentItem
              key={r.Id}
              comment={r}
              replyingToId={replyingToId}
              content={content}
              setContent={setContent}
              onReply={onReply}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
              orgMembers={orgMembers}
              isReply
            />
          ))}
        </ul>
      )}
    </li>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Content: PropTypes.string.isRequired,
    CreatedAt: PropTypes.string,
    ParentId: PropTypes.string,
    User: PropTypes.shape({ FullName: PropTypes.string }),
    replies: PropTypes.array,
  }).isRequired,
  replyingToId: PropTypes.string,
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
  onReply: PropTypes.func.isRequired,
  onSubmitReply: PropTypes.func.isRequired,
  onCancelReply: PropTypes.func.isRequired,
  orgMembers: PropTypes.array,
  isReply: PropTypes.bool,
};

export default CommentItem;
