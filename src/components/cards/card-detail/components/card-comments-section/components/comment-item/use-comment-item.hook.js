export default function useCommentItem(comment, replyingToId) {
  const isReplying = replyingToId === comment.Id;
  return { isReplying };
}
