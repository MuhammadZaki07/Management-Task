const Create = () => {
  return (
    <form className="flex flex-col gap-2 w-full">
      <label htmlFor="id" className="font-semibold block">
        Works of
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="PT KARYA"
      />
      <label htmlFor="id" className="font-semibold block">
      Curriculum
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="2025"
      />
      <label htmlFor="id" className="font-semibold">
        Book Name
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="Math"
      />
    </form>
  );
};

export default Create;
