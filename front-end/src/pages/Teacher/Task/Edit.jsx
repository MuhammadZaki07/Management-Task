const Edit = () => {
  return (
    <form className="w-full flex flex-col gap-3">
      <label htmlFor="document" className="font-semibold">
        Select Document
      </label>
      <input
        type="file"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
      />
    </form>
  );
};

export default Edit;
