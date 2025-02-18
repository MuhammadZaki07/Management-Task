const Header = () => {
  return (
    <div className="px-5 md:px-20 lg:px-32 xl:px-52 py-2 w-full">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <span className="relative text-[80px] md:text-[100px] lg:text-[150px] font-bold text-black rotate-[-20deg] skew-y-6 hidden lg:block">
          &quot;
          <span className="absolute -top-5 md:-top-8 lg:-top-10 -left-4 md:-left-6 lg:-left-8 text-[60px] md:text-[80px] lg:text-[100px] rotate-[-45deg]">
            &quot;
          </span>
          <span className="absolute -bottom-5 md:-bottom-8 lg:-bottom-10 -right-4 md:-right-6 lg:-right-8 text-[60px] md:text-[80px] lg:text-[100px] rotate-[45deg]">
            &quot;
          </span>
        </span>

        <div className="text-center lg:w-3/5">
          <h3 className="font-gummy font-light text-lg md:text-xl lg:text-2xl text-white">
            Organize, Track, and Complete Your Assignments Effortlessly
          </h3>
          <h1 className="font-medium font-gummy text-4xl md:text-5xl lg:text-7xl text-white mt-4">
            <span className="font-bold font-gummy text-5xl md:text-6xl lg:text-8xl">
              TaskMaster School
            </span>{" "}
            <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl">
              Manage Your School Tasks with Ease
            </span>
          </h1>
        </div>

        <span className="relative text-[80px] md:text-[100px] lg:text-[150px] font-bold text-black rotate-[-20deg] skew-y-6 hidden lg:block">
          &quot;
          <span className="absolute -top-5 md:-top-8 lg:-top-10 -left-4 md:-left-6 lg:-left-8 text-[60px] md:text-[80px] lg:text-[100px] rotate-[-45deg]">
            &quot;
          </span>
          <span className="absolute -bottom-5 md:-bottom-8 lg:-bottom-10 -right-4 md:-right-6 lg:-right-8 text-[60px] md:text-[80px] lg:text-[100px] rotate-[45deg]">
            &quot;
          </span>
        </span>
      </div>

      <div className="w-full md:w-8/12 lg:w-5/12 mx-auto mt-8">
        <img
          src="/assets/landingpage.png"
          className="w-full object-cover"
          alt="Landing Page"
        />
      </div>
    </div>
  );
};

export default Header;
