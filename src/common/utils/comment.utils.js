export function buildCommentTree(comments) {
  if (!comments?.length) return [];
  const byId = new Map();
  const roots = [];
  comments.forEach((c) => byId.set(c.Id, { ...c, replies: [] }));
  comments.forEach((c) => {
    const node = byId.get(c.Id);
    if (c.ParentId && byId.has(c.ParentId)) {
      byId.get(c.ParentId).replies.push(node);
    } else {
      roots.push(node);
    }
  });
  roots.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt));
  roots.forEach((r) =>
    r.replies.sort((a, b) => new Date(a.CreatedAt) - new Date(b.CreatedAt))
  );
  return roots;
}
