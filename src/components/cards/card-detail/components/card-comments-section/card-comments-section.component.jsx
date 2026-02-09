"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { MessageSquare, Plus } from "lucide-react";
import PropTypes from "prop-types";
import CommentInput from "./components/comment-input/comment-input.component";
import CommentItem from "./components/comment-item/comment-item.component";
import useCardCommentsSection from "./use-card-comments-section.hook";

function CardCommentsSection({ comments, orgMembers, onAdd }) {
  const {
    showForm,
    setShowForm,
    replyingToId,
    content,
    setContent,
    handleSubmit,
    handleCancel,
    handleReply,
    handleCancelReply,
    tree,
  } = useCardCommentsSection(comments, onAdd);

  const totalCount = comments?.length || 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="min-w-0 flex-1 flex items-center gap-2 typography-body font-semibold text-indigo-600">
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span className="truncate">Comments ({totalCount})</span>
        </h4>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition-colors hover:bg-indigo-600 focus:outline-none"
            aria-label="Add comment"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      {showForm && !replyingToId && (
        <div className="space-y-2 rounded-md bg-neutral-50 p-4 transition-opacity duration-300 ease-out">
          <div>
            <label className="mb-1 block typography-caption font-medium text-neutral-600">
              Comment
            </label>
            <CommentInput
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment… Use @ to mention someone"
              orgMembers={orgMembers}
            />
          </div>
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              size="sm"
              onClick={handleCancel}
            />
            <CustomButton
              type="button"
              text="Save"
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            />
          </div>
        </div>
      )}
      {tree.length > 0 && (
        <ul className="space-y-2">
          {tree.map((c) => (
            <CommentItem
              key={c.Id}
              comment={c}
              replyingToId={replyingToId}
              content={content}
              setContent={setContent}
              onReply={handleReply}
              onSubmitReply={handleSubmit}
              onCancelReply={handleCancelReply}
              orgMembers={orgMembers}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

CardCommentsSection.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      Content: PropTypes.string.isRequired,
      CreatedAt: PropTypes.string,
      ParentId: PropTypes.string,
      User: PropTypes.shape({
        FullName: PropTypes.string,
      }),
    })
  ),
  orgMembers: PropTypes.arrayOf(
    PropTypes.shape({
      User: PropTypes.shape({
        Id: PropTypes.string,
        FullName: PropTypes.string,
      }),
      UserId: PropTypes.string,
    })
  ),
  onAdd: PropTypes.func.isRequired,
};

export default CardCommentsSection;
