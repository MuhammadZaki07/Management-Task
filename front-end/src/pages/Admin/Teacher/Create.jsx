const Create = () => {
  return (
    <form className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="id" className="font-semibold">
            Email
          </label>
          <input
            type="email"
            className="w-full bg-white py-2 px-4 rounded-lg text-lg font-normal focus:outline-none border border-orange-500"
            placeholder="Your email"
          />
        </div>
        <div>
          <label htmlFor="id" className="font-semibold">
            Name
          </label>
          <input
            type="text"
            className="w-full bg-white py-2 px-4 rounded-lg text-lg font-normal focus:outline-none border border-orange-500"
            placeholder="Teacher Name"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="id" className="font-semibold">
            Gender
          </label>
          <select
            name="gender"
            className="w-full bg-white py-2 px-4 rounded-lg text-lg font-normal focus:outline-none border border-orange-500"
          >
            <option value="male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="id" className="font-semibold">
            Telephone
          </label>
          <input
            type="text"
            className="w-full bg-white py-2 px-4 rounded-lg text-lg font-normal focus:outline-none border border-orange-500"
            placeholder="Teacher Name"
          />
        </div>
      </div>
      <select
            name="gender"
            className="w-full bg-white py-2 px-4 rounded-lg text-lg font-normal focus:outline-none border border-orange-500"
          >
            <option value="">IPA</option>
            <option value="">IPS</option>
            <option value="">PKN</option>
          </select>
    </form>
  );
};

export default Create;
