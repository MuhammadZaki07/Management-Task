const TodoList = () => {
  return (
    <div className="px-6 flex flex-col gap-7">
      <div className="flex justify-between">
        <div className="flex flex-col g-5">
          <h1 className="font-bold text-3xl text-black">Todo list</h1>
          <p className="font-sm text-sm text-slate-500">write your work here</p>
        </div>
        <div>
          <button className="bg-orange-300 rounded-lg py-0.2 px-4 text-white hover:bg-orange-400 cursor-pointer">
            <i className="bi bi-plus text-4xl"></i>
          </button>
        </div>
      </div>
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead className="border-b-2 border-orange-300">
            <tr>
              <th className="font-medium text-lg tcen text-orange-500 py-2 text-left">
                Content
              </th>
            </tr>
          </thead>
          <tbody>
            {[1,2,3].map((item , index) => (
            <tr key={index + 1} className="border-b border-orange-500/[0.5]">
              <td className="font-light text-lg text-orange-500 py-4">
                Data {index + 1}
              </td>
              <td>
                <i className="bi bi-trash3 text-2xl font-bold text-red-500"></i>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodoList;
