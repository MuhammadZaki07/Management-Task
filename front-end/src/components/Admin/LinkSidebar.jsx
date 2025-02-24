import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

const LinkSidebar = ({ link, logo, label, showBadge, left, right, top }) => {
  const router = useLocation();
  const isActive = router.pathname === `/${link}`;

  return (
    <a
      href={`/${link}`}
      className={`rounded-lg py-2 flex items-center gap-5 px-5 ${
        isActive ? "text-orange-500 scale-110" : "text-slate-500"
      } hover:text-orange-500 hover:scale-110 transition-all duration-500 ease-in-out relative`}
    >
      {showBadge && (
        <div className={`w-2 h-2 rounded-full bg-red-500 absolute ${left} ${top} ${right} ${isActive ? "hidden" : ""}`}></div>
      )}
      {isActive && <div className="bg-orange-500 w-1 h-5 rounded-sm"></div>}
      <i
        className={`${logo} font-bold text-xl ${
          isActive ? "animate-pulse-fast" : ""
        }`}
      ></i>
      <h1 className="text-lg font-light">{label}</h1>
    </a>
  );
};

LinkSidebar.propTypes = {
  link: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  left: PropTypes.string,
  right: PropTypes.string,
  top: PropTypes.string,
  showBadge: PropTypes.bool,
};

export default LinkSidebar;
