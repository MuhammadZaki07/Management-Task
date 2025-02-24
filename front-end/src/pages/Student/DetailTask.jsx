import SubmitTask from "../../components/Student/SubmitTask";

const DetailTask = () => {
  const task = {
    name: "Matematika",
    teacher: "Mr. John Doe",
    date: "05-09-2024",
    deadline: "05-09-2024 - 07-09-2024",
    description: [
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti minima tempore ea magnam sed, laboriosam deserunt quos nesciunt itaque reiciendis dolore unde odio perspiciatis voluptate.",
      "Saepe dignissimos necessitatibus aliquam unde. Deleniti minima tempore ea magnam sed, laboriosam deserunt quos nesciunt itaque reiciendis.",
    ],
    documents: [
      { name: "Materi Bab 1.pdf", url: "#" },
      { name: "Latihan Soal.docx", url: "#" },
      { name: "Referensi Tambahan.pptx", url: "#" },
    ],
  };
  return (
    <div className="px-16 py-10 w-full">
      <div className="flex flex-col gap-2 border-b-2 border-slate-300/[0.5]">
        <div className="flex gap-5 items-center">
          <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center">
            <i className="bi bi-list-check text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-semibold">Task Name | {task.name}</h1>
        </div>
        <p className="text-slate-500 text-sm font-normal mt-2">
          Teacher : {task.teacher} | {task.date}
        </p>
        <div className="flex gap-5 items-center py-3 mb-3">
          <div className="w-3 h-3 rounded-full bg-green-600 animate-ping"></div>
          <p className="text-slate-500 text-xs font-normal">
            Deadline : {task.deadline}
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-10">
        <div className="py-5 w-1/2">
          {task.description.map((desc, index) => (
            <p
              key={index}
              className="text-slate-500 text-sm font-normal text-left mt-3"
            >
              {desc}
            </p>
          ))}
          <ul className="list-disc list-inside text-slate-500 text-sm font-normal text-left mt-3">
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
            <li>Lorem ipsum dolor sit amet.</li>
          </ul>

          <div className="mt-5">
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Documents
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {task.documents.map((doc, index) => (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg flex items-center gap-3 border border-gray-200"
                >
                  <i className="bi bi-file-earmark-text text-xl text-blue-600"></i>
                  <a
                    href={doc.url}
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {doc.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white border border-slate-300/[0.5] p-2 rounded-lg px-4">
            <div className="flex justify-between">
              <div className=" text-slate-700 text-lg font-medium">Task</div>
              <div className=" text-green-500 font-medium text-sm">Active</div>
            </div>
            <SubmitTask />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTask;
