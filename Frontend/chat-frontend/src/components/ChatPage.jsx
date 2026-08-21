import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "./ui/MessageBubble";
import ChatInput from "./ui/ChatInput";
import Avatar from "./ui/Avatar";
import { HashtagIcon, LeaveIcon, ChatIcon, UsersIcon } from "./ui/Icons";
import useChatContext from "../context/ChatContext";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import toast from "react-hot-toast";
import Stomp from "stompjs";
import { getMessagesAPI } from "../services/RoomService";

const getCurrentTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const getDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const inputDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate.getTime() === today.getTime()) {
    return "Today";
  } else if (inputDate.getTime() === yesterday.getTime()) {
    return "Yesterday";
  } else {
    return inputDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  }
};

const formatTime = (timestamp) => {
  if (!timestamp) return getCurrentTime();

  if (typeof timestamp === "string" && /^\d{1,2}:\d{2}\s?(AM|PM)$/i.test(timestamp.trim())) {
    return timestamp.trim();
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return getCurrentTime();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const groupMessagesByDate = (messages) => {
  const groups = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp || message.createdAt || Date.now());
    const dateKey = date.toDateString();

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  return groups;
};

const ChatPage = () => {
  const { roomId, username, connected } = useChatContext();

  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [draft, setDraft] = useState("");

  const navigate = useNavigate();

  const bottomRef = useRef(null);
  const stompClientRef = useRef(null);
  const sockRef = useRef(null);

  const uniqueMembers = Array.from(
    new Set([username, ...messages.map((m) => m.sender)].filter(Boolean)),
  );
  const memberCount = uniqueMembers.length;

  useEffect(() => {
    if (!connected || !roomId || !username) {
      navigate("/");
    }
  }, [connected, roomId, username, navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  useEffect(() => {
    if (!roomId || !username) {
      return;
    }

    let sock = null;
    let client = null;
    let isMounted = true;

    const connectWebSocket = () => {
      try {
        console.log("Connecting to WebSocket...");

        sock = new SockJS(`${baseURL}/chat`);
        client = Stomp.over(sock);

        client.connect(
          {},
          () => {
            if (!isMounted) {
              return;
            }

            console.log("WebSocket connected");

            stompClientRef.current = client;
            sockRef.current = sock;

            setStompClient(client);
            setIsConnected(true);

            toast.success("Connected to WebSocket server!");

            client.subscribe(`/topic/room/${roomId}`, (message) => {
              try {
                const newMessage = JSON.parse(message.body);

                console.log("Message received:", newMessage);

                const messageWithId = {
                  ...newMessage,
                  id: newMessage.id || `${newMessage.timestamp || Date.now()}-${newMessage.sender}`,
                  time: newMessage.time || formatTime(newMessage.timestamp),
                  timestamp: newMessage.timestamp || new Date().toISOString(),
                };

                setMessages((prev) => {
                  const exists = prev.some(
                    (msg) => msg.id === messageWithId.id,
                  );

                  if (exists) {
                    return prev;
                  }

                  return [...prev, messageWithId];
                });
              } catch (error) {
                console.error("Failed to parse received message:", error);
              }
            });
          },
          (error) => {
            console.error("WebSocket connection failed:", error);

            if (isMounted) {
              setIsConnected(false);
              toast.error("WebSocket connection failed");
            }
          },
        );
      } catch (error) {
        console.error("WebSocket setup error:", error);

        if (isMounted) {
          setIsConnected(false);
          toast.error("Failed to initialize WebSocket");
        }
      }
    };

    connectWebSocket();

    return () => {
      isMounted = false;

      console.log("Cleaning up WebSocket...");

      if (client) {
        try {
          client.disconnect(() => {
            console.log("WebSocket disconnected");
          });
        } catch (error) {
          console.error("Error disconnecting WebSocket:", error);
        }
      }

      if (sock) {
        try {
          sock.close();
        } catch (error) {
          console.error("Error closing SockJS:", error);
        }
      }

      stompClientRef.current = null;
      sockRef.current = null;

      setStompClient(null);
      setIsConnected(false);
    };
  }, [roomId, username]);

  const handleLeave = () => {
    if (stompClientRef.current) {
      try {
        stompClientRef.current.disconnect(() => {
          console.log("WebSocket disconnected on leave");
        });
      } catch (error) {
        console.error("Error disconnecting WebSocket:", error);
      }
    }

    stompClientRef.current = null;
    sockRef.current = null;

    setStompClient(null);
    setIsConnected(false);

    navigate("/");
  };

  const handleSend = () => {
    const content = draft.trim();

    if (!content) {
      return;
    }

    if (!stompClientRef.current || !isConnected) {
      toast.error("Not connected to chat server");
      return;
    }

    const message = {
      sender: username,
      content: content,
      timestamp: new Date().toISOString(),
    };

    try {
      stompClientRef.current.send(
        `/app/room/${roomId}`,
        {},
        JSON.stringify(message),
      );

      console.log("Message sent:", message);
      setDraft("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await getMessagesAPI(roomId);
        if (response.success) {
          const formattedMessages = response.data.map((msg) => ({
            id: msg.id || Date.now(),
            sender: msg.sender,
            content: msg.content,
            time: msg.time || formatTime(msg.timestamp),
            timestamp: msg.timestamp,
            createdAt: msg.timestamp || new Date().toISOString(),
          }));
          setMessages(formattedMessages);
          console.log("Messages loaded:", formattedMessages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load messages");
      }
    };

    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  const groupedMessages = groupMessagesByDate(messages);
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a) - new Date(b),
  );

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-slate-950">
      <header className="z-20 shrink-0 border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 sm:h-11 sm:w-11">
              <HashtagIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
                Room ID
              </p>

              <p className="truncate text-sm font-bold text-white sm:text-base">
                {roomId}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <UsersIcon className="h-4 w-4 text-cyan-400" />

            <span className="font-semibold">
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="hidden min-w-0 flex-col items-end sm:flex">
              <p className="max-w-40 truncate text-sm font-bold text-white">
                {username}
              </p>

              <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </p>
            </div>

            <Avatar name={username} size="h-9 w-9 sm:h-10 sm:w-10" />

            <button
              type="button"
              onClick={handleLeave}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 transition-all hover:border-rose-500/60 hover:bg-rose-500/20 active:scale-[0.97] sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <LeaveIcon />

              <span>Leave</span>
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8">
          <div className="mx-auto mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-center text-[10px] font-medium text-slate-400 sm:mb-6 sm:text-xs">
            Messages are end-to-end encrypted
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-600 ring-1 ring-white/10 sm:h-20 sm:w-20">
                  <ChatIcon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-white sm:text-xl">
                  No messages yet
                </h2>

                <p className="mt-1.5 text-sm text-slate-500">
                  Say hello to start the conversation!
                </p>
              </div>
            ) : (
              sortedDates.map((dateKey) => (
                <div key={dateKey} className="flex flex-col gap-4 sm:gap-5">
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-xs font-medium text-slate-500">
                      {getDateLabel(dateKey)}
                    </span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {groupedMessages[dateKey].map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isOwn={message.sender === username}
                      userName={username}
                    />
                  ))}
                </div>
              ))
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      </main>

      <footer className="z-20 shrink-0 border-t border-white/10 bg-slate-900">
        <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
          <ChatInput value={draft} onChange={setDraft} onSend={handleSend} />
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
