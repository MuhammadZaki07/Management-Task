const Create = () => {
  return (
    <form className="flex flex-col gap-2 w-full">
      <label htmlFor="id" className="font-semibold block">
        ID
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="1231"
      />
      <label htmlFor="id" className="font-semibold">
      Departement Name
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="Departement Name"
      />
    </form>
  );
};

export default Create;
