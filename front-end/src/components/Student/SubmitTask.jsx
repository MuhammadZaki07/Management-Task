const SubmitTask = () => {
  return (
    <>
    <form className="w-full flex flex-col gap-2 py-5">
        <label htmlFor="task_file">Document <span className="text-xs text-red-500">*pdf</span></label>
        <input type="file" name="task_file" className="bg-gray-100 w-full py-2 rounded-lg border border-slate-300/[0.5] focus:outline-none px-2"/>
        <button className="bg-blue-500 w-full rounded text-white py-2">Submit</button>
    </form>
    </>
  )
}

export default SubmitTask