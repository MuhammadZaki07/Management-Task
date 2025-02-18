const Edit = () => {
  return (
    <form className="flex flex-col gap-2 w-full">
    <label htmlFor="id" className="font-semibold block">
      Works of
    </label>
    <input
      type="text"
      className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
      value="PT KARYA"
    />
    <label htmlFor="id" className="font-semibold block">
    Curriculum
    </label>
    <input
      type="text"
      className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
      value="2025"
    />
    <label htmlFor="id" className="font-semibold">
      Book Name
    </label>
    <input
      type="text"
      className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
      value="Math"
    />
  </form>
  );
};

export default Edit;
