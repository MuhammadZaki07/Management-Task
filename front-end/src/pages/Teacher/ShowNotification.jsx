import PropTypes from "prop-types";

const ShowNotification = ({ data }) => {
  if (!data) {
    return <p className="text-slate-500 text-sm">Tidak ada notifikasi yang dipilih.</p>;
  }

  return (
    <div>
      <h1 className="text-lg font-bold text-slate-900">{data.type.replace("_", " ")}</h1>
      <p className="text-slate-500 text-sm mt-2">{data.message}</p>
      <p className="text-slate-400 text-xs mt-4">
        {new Date(data.created_at).toLocaleString()}
      </p>
    </div>
  );
};

ShowNotification.propTypes = {
  data: PropTypes.shape({
    type: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }),
};

export default ShowNotification;
