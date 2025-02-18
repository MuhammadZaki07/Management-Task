const Login = () => {
  return (
    <div className="w-full flex justify-center items-center h-screen px-5 lg:px-56">
      <div className="w-full lg:border border-slate-400/[0.5] lg:bg-white rounded-xl flex justify-between gap-20 lg:px-20 px-5 py-10">
        <div className="w-full lg:flex items-center flex-col hidden">
          <img src="/assets/Auth.png" alt="Auth.png" />
        </div>
        <div className="w-full flex items-center">
          <form className="flex flex-col gap-5 w-full">
            <div className="space-y-6">
              <div className="flex gap-5">
                <img src="/assets/logoblack.png" className="w-20" alt="logo" />
              <h1 className="font-bold font-gummy text-6xl text-center lg:text-left">Login</h1>
              </div>
              <p className="text-slate-400 hidden">
                Welcome to{" "}
                <span className="font-semibold text-blue-500">
                  Task Management School (TMS)
                </span>
                ! Easily organize and manage your school tasks efficiently. Log
                in now to start tracking, managing, and completing your
                assignments on time. Boost your productivity with TMS!
              </p>
            </div>
            <div className="row">
              <label htmlFor="email" className="font-gummy text-light text-lg">
                Email
              </label>
              <input
                type="email"
                placeholder="Your Email"
                className="block w-full rounded-lg border border-slate-300/[0.5] text-slate-500 font-normal bg-white lg:py-4 py-2.5 px-5 text-lg focus:outline-none"
              />
              <p className="text-red-500 text-sm  mt-3"></p>
            </div>
            <div className="row">
              <label htmlFor="email" className="font-gummy text-light text-lg">
                Password
              </label>
              <input
                type="email"
                placeholder="Password"
                className="block w-full rounded-lg border border-slate-300/[0.5] text-slate-500 font-normal bg-white lg:py-4 py-2.5 px-5 focus:outline-none"
              />
            </div>
            <button className="w-1/2 mx-auto bg-amber-300 py-3 rounded-lg text-white text-xl hover:bg-amber-500 cursor-pointer ">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
