const Edit = () => {
  return (
    <form className="flex flex-col gap-2 w-full">
      <label htmlFor="id" className="font-semibold block">
        ID
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="#ID"
        value={`#02030`}
      />
      <label htmlFor="id" className="font-semibold">
        Name
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="Class Name"
        value={`B-3-41`}
      />
    </form>
  );
};

export default Edit;
