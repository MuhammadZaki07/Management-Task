const Navbar = () => {
  return (
    <nav className="w-full flex justify-between py-5 lg:py-14 px-8 lg:px-52">
      <div className="flex gap-2">
        <img src="/assets/logowhite.png" className="w-16" alt="" />
      <h1 className="font-bold font-gummy text-4xl lg:text-5xl text-white">TMS</h1>
      </div>
      <div className="">
        <a
          href="/login"
          className="font-light font-gummy text-white text-xl lg:text-3xl underline"
        >
          Login <i className="bi bi-box-arrow-in-right"></i>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
