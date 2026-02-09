"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { getAccessToken } from "@/common/utils/access-token.util";
import { addNotification } from "@/provider/features/notifications/notifications.slice";

const getSocketUrl = () => {
  const url = process.env.NEXT_PUBLIC_MAIN_URL || "";
  if (url.startsWith("https://")) return url;
  if (url.startsWith("http://")) return url;
  return url || (typeof window !== "undefined" ? window.location.origin : "");
};

/**
 * Connects to the socket for real-time notifications.
 * Backend auto-joins user to user:userId on connection.
 * Should be used in Private layout so it runs when user is logged in.
 */
export default function useNotificationsSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const baseUrl = getSocketUrl();
    const socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("notification:created", (payload) => {
      dispatch(addNotification(payload));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
}
