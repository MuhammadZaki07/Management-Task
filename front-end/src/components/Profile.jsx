const Profile = () => {
  return (
    <div className="px-16 py-10 flex gap-10 items-start">
      <div>
        <img
          src="/assets/profile.png"
          className="w-72 rounded-lg"
          alt="Profile"
        />
      </div>
      <form className="w-full">
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="name" className="text-lg font-semibold">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value="Muhamad Zaki Ulumuddin"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="age" className="text-lg font-semibold">
                Age
              </label>
              <input
                type="text"
                id="age"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value="18"
              />
            </div>
          </div>
          <div className="w-full flex gap-5">
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="class" className="text-lg font-semibold">
                No tlp
              </label>
              <input
                type="text"
                id="class"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value="0888888888"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="department" className="text-lg font-semibold">
                Teacher Of
              </label>
              <input
                type="text"
                id="department"
                className="w-full bg-white rounded-lg focus:outline-none border border-orange-500 px-4 py-2 text-lg font-light"
                value="Rekayasa Perangkat Lunak"
              />
            </div>
          </div>
          <div className="flex justify-end">
          <button
                type="button"
                className="inline-flex w-1/7 cursor-pointer justify-center rounded-md bg-orange-600 px-3 py-3 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3"
              >
                Update
              </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
