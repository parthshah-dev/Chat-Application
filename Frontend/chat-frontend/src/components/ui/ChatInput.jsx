import { SendIcon } from "./Icons";

const ChatInput = ({ value, onChange, onSend }) => {
  const canSend = value.trim().length > 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  return (
    <div className="flex items-center gap-2.5 sm:gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 sm:py-3.5 sm:text-base"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        className={`flex shrink-0 items-center justify-center rounded-xl px-4 py-3 font-semibold transition-all sm:px-5 sm:py-3.5 ${
          canSend
            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40 active:scale-[0.97]"
            : "cursor-not-allowed border border-white/10 bg-white/5 text-slate-600"
        }`}
      >
        <SendIcon />
        <span className="ml-2 hidden sm:inline">Send</span>
      </button>
    </div>
  );
};

export default ChatInput;
