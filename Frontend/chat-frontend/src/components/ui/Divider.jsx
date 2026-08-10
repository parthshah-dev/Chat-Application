const Divider = ({ label = "or" }) => {
  return (
    <div className="my-4 flex items-center gap-3 sm:my-5">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
};

export default Divider;
