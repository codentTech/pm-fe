import { useMemo } from "react";

function parseMentions(content, orgMembers) {
  const names = (orgMembers || [])
    .map((m) => m.User?.FullName || "Unknown")
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  if (names.length === 0) {
    return content.split(/(@[^\s@]+)/g);
  }

  const parts = [];
  let i = 0;

  while (i < content.length) {
    if (content[i] === "@") {
      const afterAt = content.slice(i + 1);
      let matched = null;

      for (const name of names) {
        if (afterAt.startsWith(name)) {
          const nextChar = afterAt[name.length];
          if (!nextChar || !/[\w]/.test(nextChar)) {
            matched = name;
            break;
          }
        }
      }

      if (matched) {
        parts.push("@" + matched);
        i += 1 + matched.length;
      } else {
        const singleWordMatch = afterAt.match(/^([^\s@]+)/);
        if (singleWordMatch) {
          parts.push("@" + singleWordMatch[1]);
          i += 1 + singleWordMatch[1].length;
        } else {
          parts.push("@");
          i += 1;
        }
      }
    } else {
      const nextAt = content.indexOf("@", i);
      const end = nextAt === -1 ? content.length : nextAt;
      parts.push(content.slice(i, end));
      i = end;
    }
  }

  return parts.filter((p) => p !== "");
}

export default function useCommentContent(content, orgMembers) {
  return useMemo(() => parseMentions(content, orgMembers), [content, orgMembers]);
}
