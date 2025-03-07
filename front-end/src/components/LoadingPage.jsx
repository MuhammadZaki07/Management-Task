const LoadingPage = () => {
  return (
    <div className="px-16 pb-20">
      <div className="flex justify-between items-center py-7">
        <div className="flex flex-col gap-3 w-full">
          <div className="bg-slate-200 rounded-lg w-1/5 h-7 px-5 animate-pulse"></div>
          <div className="bg-slate-200 rounded-lg w-1/3 h-3 px-5 animate-pulse"></div>
          <div className="bg-slate-300 w-1/2 h-3 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-5 py-10">
          <div className="bg-slate-200 w-13 h-13 rounded-full animate-pulse"></div>
          <div className="bg-slate-200 w-13 h-13 rounded-full animate-pulse"></div>
          <div className="bg-slate-200 w-13 h-13 rounded-full animate-pulse"></div>
          <div className="bg-slate-200 w-13 h-13 rounded-full animate-pulse"></div>
        </div>
        <div className="flex gap-5 py-10">
          <div className="bg-slate-200 w-72 h-13 rounded-lg animate-pulse"></div>
          <div className="bg-slate-200 w-32 h-13 rounded-lg animate-pulse"></div>
        </div>
      </div>
      <div className="bg-slate-200 w-full h-13 rounded-t-lg animate-pulse flex items-center px-5 gap-10">
        <div className="bg-slate-50 w-8 h-6 rounded-sm animate-pulse"></div>
        <div className="bg-slate-50 w-1/5 h-6 rounded-lg animate-pulse"></div>
        <div className="bg-slate-50 w-1/6 h-6 rounded-lg animate-pulse"></div>
        <div className="bg-slate-50 w-1/2 h-6 rounded-lg animate-pulse"></div>
        <div className="bg-slate-50 w-1/5 h-6 rounded-lg animate-pulse"></div>
      </div>
      {Array.from({ length: 35 }, (_, i) => i + 1).map((i) => (
        <div
          key={i + 1}
          className={`${
            i % 2 ? "bg-slate-50" : "bg-slate-100"
          } w-full h-13 animate-pulse flex items-center px-5 gap-10`}
        >
          <div className="bg-slate-200 w-5 h-4 rounded-sm animate-pulse"></div>
          <div className="bg-slate-200 w-1/5 h-3 rounded-lg animate-pulse"></div>
          <div className="bg-slate-200 w-1/6 h-3 rounded-lg animate-pulse"></div>
          <div className="bg-slate-200 w-1/2 h-3 rounded-lg animate-pulse"></div>
          <div className="bg-slate-200 w-1/5 h-3 rounded-lg animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingPage;
