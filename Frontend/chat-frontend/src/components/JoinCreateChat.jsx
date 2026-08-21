import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextInput from "./ui/TextInput";
import ActionButton from "./ui/ActionButton";
import Divider from "./ui/Divider";
import {
  UserIcon,
  HashtagIcon,
  ArrowRightIcon,
  PlusIcon,
  ChatIcon,
  ShieldIcon,
  BoltIcon,
} from "./ui/Icons";
import { createRoomAPI, joinRoomAPI } from "../services/RoomService";
import { toast } from "react-hot-toast";
import useChatContext from "../context/ChatContext";

const FeatureBadge = ({ icon: Icon, text }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-400 sm:px-3 sm:py-1.5 sm:text-xs">
    <Icon className="h-3.5 w-3.5 text-cyan-400" />
    {text}
  </span>
);

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({ name: "", roomId: "" });
  const [errors, setErrors] = useState({ name: "", roomId: "" });

  const { roomId, setRoomId, username, setUsername, connected, setConnected } =
    useChatContext();

  const Navigate = useNavigate();

  const validateName = () => {
    if (!detail.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return false;
    }
    return true;
  };

  const validateRoomId = () => {
    if (!roomId.trim()) {
      setErrors((prev) => ({ ...prev, roomId: "Room ID is required" }));
      return false;
    }
    return true;
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleJoin = async () => {
    const validName = validateName();
    const validRoomId = validateRoomId();
    if (validName && validRoomId) {
      setErrors({ name: "", roomId: "" });

      try {
        const room = await joinRoomAPI(roomId.trim());
        if (room.success) {
          toast.success("Successfully joined the room!");

          setUsername(detail.name.trim());
          setRoomId(room.data.roomId);
          setConnected(true);

          Navigate("/chat");
        } else {
          toast.error(room.message || "Failed to join room");
        }
      } catch (error) {
        toast.error("Error joining room:", error);
      }
    }
  };

  const handleCreate = async () => {
    if (validateName()) {
      setErrors((prev) => ({ ...prev, roomId: "" }));

      try {
        const response = await createRoomAPI({
          roomId: roomId.trim(),
          name: detail.name.trim(),
        });
        if (response.success) {
          toast.success("Successfully created the room!");

          setUsername(detail.name.trim());
          setRoomId(response.data.roomId);
          setConnected(true);

          Navigate("/chat");

          console.log(response.data);
        } else {
          toast.error(response.message || "Failed to create room");
        }
      } catch (error) {
        toast.error("Error creating room:", error);
      }
    }
  };

  return (
    <div className="relative flex h-dvh items-center justify-center overflow-hidden bg-slate-950 px-4 py-6 sm:py-10">
      <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl animate-bounce-slow sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-cyan-500/25 blur-3xl animate-bounce-slow animation-delay-1000 sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 hidden h-72 w-72 -translate-x-1/2 rounded-full bg-fuchsia-500/15 blur-3xl md:block" />

      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
        <div className="mb-5 flex flex-col items-center text-center sm:mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-2xl shadow-violet-500/40 ring-1 ring-white/20 sm:h-16 sm:w-16">
            <ChatIcon />
          </div>
          <h1 className="mt-3.5 text-2xl font-bold text-white sm:mt-5 sm:text-3xl">
            Welcome to{" "}
            <span className="bg-linear-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Chatly
            </span>
          </h1>
          <p className="mt-1.5 text-xs text-slate-400 sm:mt-2.5 sm:text-sm">
            Join an existing room or create a new one to start chatting
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-7">
          <div className="space-y-4">
            <TextInput
              id="name"
              label="Your Name"
              placeholder="Enter your name"
              icon={UserIcon}
              value={detail.name}
              onChange={(e) => {
                setDetail((prev) => ({ ...prev, name: e.target.value }));
                clearError("name");
              }}
              error={errors.name}
            />
            <TextInput
              id="roomId"
              label="Room ID"
              placeholder="e.g. ABC12345"
              icon={HashtagIcon}
              value={roomId}
              onChange={(e) => {
                setRoomId(e.target.value);
                clearError("roomId");
              }}
              error={errors.roomId}
            />
          </div>

          <div className="mt-5 space-y-3 sm:mt-6">
            <ActionButton icon={ArrowRightIcon} onClick={handleJoin}>
              Join Room
            </ActionButton>
            <Divider />
            <ActionButton
              variant="secondary"
              icon={PlusIcon}
              onClick={handleCreate}
            >
              Create New Room
            </ActionButton>
          </div>

          <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:mt-6 sm:flex-row sm:gap-3">
            <FeatureBadge icon={ShieldIcon} text="End-to-end encryption" />
            <FeatureBadge icon={BoltIcon} text="Real-time WebSockets" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
