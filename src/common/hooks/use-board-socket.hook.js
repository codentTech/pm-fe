"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { getAccessToken } from "@/common/utils/access-token.util";
import {
  applyRemoteCardMoved,
  applyRemoteCardCreated,
  applyRemoteCardUpdated,
  applyRemoteCardDeleted,
  applyRemoteListCreated,
  applyRemoteListDeleted,
} from "@/provider/features/boards/boards.slice";

const getSocketUrl = () => {
  const url = process.env.NEXT_PUBLIC_MAIN_URL || "";
  if (url.startsWith("https://")) return url.replace("https://", "https://");
  if (url.startsWith("http://")) return url.replace("http://", "http://");
  return url || (typeof window !== "undefined" ? window.location.origin : "");
};

export default function useBoardSocket(boardId) {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!boardId) return;

    const token = getAccessToken();
    if (!token) return;

    const baseUrl = getSocketUrl();
    const socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("board:join", boardId);
    });

    socket.on("board:joined", () => {
      // Joined successfully
    });

    socket.on("card:moved", (payload) => {
      dispatch(applyRemoteCardMoved(payload));
    });

    socket.on("card:created", (payload) => {
      dispatch(applyRemoteCardCreated(payload));
    });

    socket.on("card:updated", (payload) => {
      dispatch(applyRemoteCardUpdated(payload));
    });

    socket.on("card:deleted", (payload) => {
      dispatch(applyRemoteCardDeleted(payload));
    });

    socket.on("list:created", (payload) => {
      dispatch(applyRemoteListCreated(payload));
    });

    socket.on("list:deleted", (payload) => {
      dispatch(applyRemoteListDeleted(payload));
    });

    return () => {
      socket.emit("board:leave", boardId);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [boardId, dispatch]);
}
