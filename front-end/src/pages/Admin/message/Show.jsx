import PropTypes from "prop-types";

const Show = ({ data }) => {
  if (!data) return null;

  return (
    <div className="w-full">
      <h1 className="font-semibold text-slate-800 text-lg">{data.title}</h1>
      <p className="text-slate-500 text-sm mt-3">{data.message}</p>
      <p className="text-slate-400 text-xs mt-2">
        {new Date(data.created_at).toLocaleString()}
      </p>
    </div>
  );
};

Show.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }),
};

export default Show;
