import PropTypes from "prop-types";

const CardDashboard = ({ title, count, logo, loading }) => {
  return (
    <div className={`bg-[#f5f2f0] rounded-xl p-6 w-60 flex flex-col gap-2 ${loading ? "animate-pulse" : ""}`}>
      <h1 className="font-medium text-slate-500 text-left">{title}</h1>
      <div className="flex gap-20 justify-between">
        {loading ? (
          <div className="w-10 h-6 bg-gray-300 rounded"></div>
        ) : (
          <h1 className="font-semibold text-2xl text-slate-500">{count}</h1>
        )}
        <i className={`bi ${logo} text-4xl text-slate-500`}></i>
      </div>
    </div>
  );
};

CardDashboard.propTypes = {
  title: PropTypes.string,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  logo: PropTypes.string,
  loading: PropTypes.bool,
};

export default CardDashboard;
