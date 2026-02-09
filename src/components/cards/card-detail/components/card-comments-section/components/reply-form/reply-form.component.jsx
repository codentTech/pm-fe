"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import PropTypes from "prop-types";
import CommentInput from "../comment-input/comment-input.component";
import useReplyForm from "./use-reply-form.hook";

function ReplyForm({ content, setContent, orgMembers, onSubmit, onCancel }) {
  useReplyForm();

  return (
    <div className="mt-2 space-y-2 rounded-md bg-neutral-50 p-4 transition-opacity duration-300 ease-out">
      <div>
        <label className="mb-1 block typography-caption font-medium text-neutral-600">
          Reply
        </label>
        <CommentInput
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a reply… Use @ to mention someone"
          orgMembers={orgMembers}
        />
      </div>
      <div className="flex justify-end gap-2">
        <CustomButton
          type="button"
          text="Cancel"
          variant="cancel"
          size="sm"
          onClick={onCancel}
        />
        <CustomButton
          type="button"
          text="Reply"
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            onSubmit(e);
          }}
        />
      </div>
    </div>
  );
}

ReplyForm.propTypes = {
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
  orgMembers: PropTypes.array,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ReplyForm;
