import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
  return (
    <div className="w-full py-7 items-center flex gap-15 justify-between px-16 border-b border-[#5b6087]/[0.1]">
      <div className="flex items-center gap-10">
        <h1 className="text-[#5b6087] font-medium text-xl">Dashboard {location.pathname === "/dashboard" ? "" : location.pathname}</h1>
      </div>
      <div className="flex gap-15">
        <a href="">
          <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-box-arrow-right"></i>
        </a>
        <a href="">
          <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-arrows-fullscreen"></i>
        </a>
      <Link to={`lesson`}>
          <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-journal-plus"></i>
        </Link>
        <Link to={`profile`}>
          <i className="text-xl text-slate-700 hover:text-slate-400 font-semibold bi bi-person-circle"></i>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
