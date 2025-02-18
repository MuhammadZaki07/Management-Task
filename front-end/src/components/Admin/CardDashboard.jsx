import PropTypes from "prop-types";

const CardDashboard = ({ title, count, logo }) => {
  return (
    <div className="bg-[#f5f2f0] rounded-xl p-6 w-60 flex flex-col gap-2">
      <h1 className="font-light text-slate-500 text-left">{title}</h1>
      <div className="flex gap-20">
        <h1 className="font-semibold text-2xl text-slate-500">{count}</h1>
        <i className={`${logo} text-4xl text-slate-500`}></i>
      </div>
    </div>
  );
};

CardDashboard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string,PropTypes.number]),
  logo: PropTypes.string,
};

export default CardDashboard;
