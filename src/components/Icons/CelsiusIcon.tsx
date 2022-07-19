const CelsiusIcon = () => {
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
      <path d="M20 9a3 3 0 0 0 -3 -3h-1a3 3 0 0 0 -3 3v6a3 3 0 0 0 3 3h1a3 3 0 0 0 3 -3" />
    </svg>
  );
};

export default CelsiusIcon;
