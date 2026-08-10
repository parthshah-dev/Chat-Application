const TextInput = ({
  id,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-300 sm:mb-2"
      >
        {label}
      </label>
      <div className="group relative">
        {Icon && (
          <span
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-violet-400 ${
              error ? "text-rose-400" : "text-slate-500"
            }`}
          >
            <Icon />
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border bg-slate-900/60 py-3 pr-4 text-white placeholder-slate-500 outline-none transition-all sm:py-3.5 ${
            error
              ? "border-rose-500/70 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20"
              : "border-white/10 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20"
          }`}
          style={{ paddingLeft: Icon ? "3rem" : "1rem" }}
        />
      </div>
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-400 sm:text-sm">
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;
