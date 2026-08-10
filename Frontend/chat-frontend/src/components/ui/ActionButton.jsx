const ActionButton = ({ variant = "primary", children, icon: Icon, onClick }) => {
  const styles = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/40",
    secondary:
      "border border-white/10 bg-white/5 text-slate-200 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-300",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-all active:scale-[0.98] sm:py-3.5 ${styles[variant]}`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
};

export default ActionButton;
