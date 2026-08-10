const Avatar = ({ name, size = "h-9 w-9 sm:h-10 sm:w-10" }) => {
  return (
    <img
      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(
        name
      )}`}
      alt={name}
      title={name}
      loading="lazy"
      className={`${size} shrink-0 rounded-full bg-slate-800 ring-2 ring-white/10`}
    />
  );
};

export default Avatar;
