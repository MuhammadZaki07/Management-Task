const TaskPending = () => {
  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-10 space-y-3 mt-5">
      <h1 className="font-semibold text-2xl text-[#5b6087]">TaskPending</h1>
      <p className="text-slate-500 font-light">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod,
        perspiciatis.
      </p>
      <div className="bg-white rounded-xl w-full p-3">
        <div className="flex items-start gap-5">
          <img
            src="/student/student-1.jpg"
            className="w-28 rounded-xl overflow-hidden"
            alt="student-1.jpg"
          />
          <div className="flex gap-2 flex-col border-r-5 border-dotted border-r-orange-500 w-5/7 px-3">
            <h1 className="font-bold text-sm text-[#5b6087]">
              Muhamad Zaki Ulumuddin
            </h1>
            <h3 className="font-light text-xs text-[#5b6087]">
              Rekayasa Perangkat Lunak | XII
            </h3>
            <p className="font-light text-slate-500 text-sm">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Placeat
              fugit cupiditate rem soluta delectus molestias quae dolorem ad.
              Vitae, aspernatur.
            </p>
          </div>
          <div className="flex flex-col gap-1 py-2">
            <span className="text-slate-500 text-xs">Time : 08 : 00</span>
            <span className="text-slate-500 text-xs">
              Subjects : Mathematic
            </span>
            <div className="flex gap-4">
              <input
                type="text"
                className="bg-white rounded-xl w-full focus:outline-none text-slate-500 font-normal text-sm px-4 border border-orange-500 py-2 flex-[3]"
                placeholder="ex: 10-100"
              />
              <button className="bg-orange-400 text-white rounded-xl flex-[5]">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPending;
