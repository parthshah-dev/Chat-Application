import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MessageBubble from "./ui/MessageBubble";
import ChatInput from "./ui/ChatInput";
import Avatar from "./ui/Avatar";
import { HashtagIcon, LeaveIcon, ChatIcon, UsersIcon } from "./ui/Icons";

const initialMessages = [
  {
    id: 1,
    sender: "Alice",
    text: "Hey everyone! Welcome to the room 🎉",
    time: "10:24 AM",
  },
  {
    id: 2,
    sender: "Bob",
    text: "Morning all 👋",
    time: "10:26 AM",
  },
  {
    id: 3,
    sender: "Charlie",
    text: "What's the topic of discussion today?",
    time: "10:28 AM",
  },
];

const getCurrentTime = () => {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};

const ChatPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const bottomRef = useRef(null);

  const userName = searchParams.get("name") || "Guest";
  const roomId = searchParams.get("roomId") || "UNKNOWN";

  const groupMembers = ["Alice", "Bob", "Charlie"];

  // Automatically scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  const handleSend = () => {
    const text = draft.trim();

    if (!text) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: userName,
        text,
        time: getCurrentTime(),
      },
    ]);

    setDraft("");
  };

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-950">
      {/* ================= HEADER ================= */}
      <header className="z-20 shrink-0 border-b border-white/10 bg-slate-900">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Room Info */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 sm:h-11 sm:w-11">
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

          {/* Members */}
          <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
            <UsersIcon className="h-4 w-4 text-cyan-400" />

            <span className="font-semibold">
              {groupMembers.length + 1} members
            </span>
          </div>

          {/* User + Leave */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <div className="hidden min-w-0 flex-col items-end sm:flex">
              <p className="max-w-40 truncate text-sm font-bold text-white">
                {userName}
              </p>

              <p className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Online
              </p>
            </div>

            <Avatar name={userName} size="h-9 w-9 sm:h-10 sm:w-10" />

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

      {/* ================= MESSAGE AREA ================= */}
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto flex w-full max-w-4xl flex-col px-4 pb-6 pt-6 sm:px-6 sm:pb-8 sm:pt-8">
          {/* Encryption Message */}
          <div className="mx-auto mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-center text-[10px] font-medium text-slate-400 sm:mb-6 sm:text-xs">
            Messages are end-to-end encrypted
          </div>

          {/* Messages */}
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
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.sender === userName}
                  userName={userName}
                />
              ))
            )}

            {/* Scroll target */}
            <div ref={bottomRef} />
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="z-20 shrink-0 border-t border-white/10 bg-slate-900">
        <div className="mx-auto w-full max-w-4xl px-4 py-3 sm:px-6 sm:py-4">
          <ChatInput value={draft} onChange={setDraft} onSend={handleSend} />
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
