const Create = () => {
  return (
    <form className="flex flex-col gap-2 w-full">
      <label htmlFor="id" className="font-semibold block">
        Title Message
      </label>
      <input
        type="text"
        className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500"
        placeholder="Title Message"
      />
      <textarea name="description" rows={5} placeholder="Description"  className="w-full bg-white py-2 px-4 rounded-lg text-sm font-normal focus:outline-none border border-orange-500">

      </textarea>
    </form>
  );
};

export default Create;
