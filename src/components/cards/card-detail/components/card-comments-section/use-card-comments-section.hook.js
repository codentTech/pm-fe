import { useCallback, useMemo, useState } from "react";
import { buildCommentTree } from "@/common/utils/comment.utils";

export default function useCardCommentsSection(comments, onAdd) {
  const [showForm, setShowForm] = useState(false);
  const [replyingToId, setReplyingToId] = useState(null);
  const [content, setContent] = useState("");

  const handleSubmit = useCallback(
    (e, parentId = null) => {
      e.preventDefault();
      if (content?.trim()) {
        onAdd(content.trim(), parentId);
        setTimeout(() => {
          setContent("");
          setShowForm(false);
          setReplyingToId(null);
        }, 300);
      }
    },
    [content, onAdd]
  );

  const handleCancel = useCallback(() => {
    setShowForm(false);
    setReplyingToId(null);
    setContent("");
  }, []);

  const handleReply = useCallback((commentId) => {
    setReplyingToId(commentId);
    setShowForm(true);
  }, []);

  const handleCancelReply = useCallback(() => {
    setReplyingToId(null);
  }, []);

  const tree = useMemo(() => buildCommentTree(comments), [comments]);

  return {
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
  };
}
