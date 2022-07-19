const FahrenheitIcon = () => {
  return (
    <svg
      className="h-6 w-6 m-1 text-slate-900 dark:text-slate-200 inline"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {" "}
      <path stroke="none" d="M0 0h24v24H0z" /> <circle cx="6" cy="8" r="2" />{" "}
      <line x1="13" y1="12" x2="18" y2="12" />{" "}
      <path d="M20 6h-6a1 1 0 0 0 -1 1v11" />
    </svg>
  );
};

export default FahrenheitIcon;
