const TaskPending = () => {
  return (
    <div className="bg-white rounded-xl w-full p-3">
      <div className="flex items-center gap-5">
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
            Vitae.....
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-lg flex items-center gap-3 border border-gray-200">
              <i className="bi bi-file-earmark-text text-xl text-blue-600"></i>
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Html
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 py-2">
          <span className="text-slate-500 text-xs">Time : 08 : 00</span>
          <span className="text-slate-500 text-xs">Subjects : Mathematic</span>
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
  );
};

export default TaskPending;
