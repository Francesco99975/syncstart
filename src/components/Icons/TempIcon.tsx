const TempIcon = () => {
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
      <path stroke="none" d="M0 0h24v24H0z" />{" "}
      <path d="M10 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 0 0 -4 0v8.5" />{" "}
      <line x1="10" y1="9" x2="14" y2="9" />
    </svg>
  );
};

export default TempIcon;
