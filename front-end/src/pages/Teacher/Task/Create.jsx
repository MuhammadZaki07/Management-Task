import { useState } from "react";

const Task = () => {
  const [isDeadlineEnabled, setIsDeadlineEnabled] = useState(false);
  return (
    <form className="w-full flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-slate-700">Task Name</label>
          <input type="text" className="w-full bg-white font-normal py-1.5 px-4 rounded-lg focus:outline-none border border-gray-300" />
        </div>
        <div>
          <label className="font-medium text-slate-700">Lesson</label>
          <select name="lesson" id="lesson" className="w-full bg-white font-normal py-1.5 px-4 rounded-lg focus:outline-none border border-gray-300">
            <option value="">10-RPL-A</option>
            <option value="">10-RPL-B</option>
            <option value="">11-RPL-A</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-slate-700">Date</label>
          <input type="date" className="w-full bg-white font-normal py-1.5 px-4 rounded-lg focus:outline-none border border-gray-300" />
        </div>
        <div>
          <label className="font-medium text-slate-700">Lesson</label>
          <select name="lesson" id="lesson" className="w-full bg-white font-normal py-1.5 px-4 rounded-lg focus:outline-none border border-gray-300">
            <option value="">IPA</option>
            <option value="">IPS</option>
            <option value="">Premrogaman</option>
          </select>
        </div>
      </div>
      
      <div className="flex flex-col gap-5">
        <div>
          <label className="font-medium text-slate-700">Documents</label>
          <input type="file" multiple className="w-full bg-white font-normal py-1.5 px-4 rounded-lg focus:outline-none border border-gray-300" min="0" />
        </div>
        <div className="">
          <textarea name="description" id="description" className="w-full bg-white font-normal py-1.5 px-4 rounded-lg focus:outline-none border border-gray-300" placeholder="Task Decription"></textarea>
        </div>
      </div>
      
      <div className="w-1/3">
        <label className="font-medium text-slate-700 flex items-center gap-2">
          <input 
            type="checkbox" 
            className="w-4 h-4" 
            onChange={(e) => setIsDeadlineEnabled(e.target.checked)} 
          /> Enable Deadline
        </label>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="font-medium text-slate-700">Start Deadline</label>
          <input type="date" className={`w-full py-2 px-4 rounded-lg focus:outline-none border border-gray-300 ${!isDeadlineEnabled ? "bg-gray-100" : "bg-white"}`} disabled={!isDeadlineEnabled}  />
        </div>
        <div>
          <label className="font-medium text-slate-700">End Deadline</label>
          <input type="date" className={`w-full py-2 px-4 rounded-lg focus:outline-none border border-gray-300 ${!isDeadlineEnabled ? "bg-gray-100" : "bg-white"}`} disabled={!isDeadlineEnabled}  />
        </div>
      </div>
      
      <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-all cursor-pointer">Submit</button>
    </form>
  );
};

export default Task;
