import Avatar from "./Avatar";

const MessageBubble = ({ message, isOwn, userName }) => {
  const senderName = isOwn ? "You" : message.sender;

  return (
    <div className={`flex gap-2.5 sm:gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
      <Avatar name={isOwn ? userName : message.sender} />

      <div
        className={`flex max-w-[75%] flex-col sm:max-w-[70%] ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        <p
          className={`mb-1 px-1 text-xs font-semibold ${
            isOwn ? "text-violet-400" : "text-cyan-400"
          }`}
        >
          {senderName}
        </p>

        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed sm:px-4.5 sm:text-[15px] ${
            isOwn
              ? "rounded-br-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20"
              : "rounded-bl-md border border-white/10 bg-white/5 text-slate-100 shadow-lg shadow-black/20"
          }`}
        >
          {message.text}
        </div>

        <time className="mt-1 px-1 text-[10px] font-medium text-slate-500 sm:text-xs">
          {message.time}
        </time>
      </div>
    </div>
  );
};

export default MessageBubble;
