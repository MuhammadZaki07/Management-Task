import ReactApexChart from "react-apexcharts";

const Gender = () => {
  const options = {
    series: [85, 80],
    chart: {
      height: 30,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "30px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function () {
              return 500;
            },
          },
        },
      },
    },
    labels: ["Student Male", "Student Female"],
    colors: ["#5b6087", "#f7b797"],
  };

  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-5 flex-[1]">
      <ReactApexChart
        options={options}
        series={options.series}
        type="radialBar"
        height={350}
      />
      <div className="flex flex-col gap-3">
        <h1 className="font-semibold text-2xl text-[#5b6087]">Student</h1>
        <div className="flex gap-5 items-center justify-start py-3">
          <div className="w-8 h-8 rounded-full bg-[#5b6087] flex justify-center items-center">
            <i className="bi bi-gender-female text-white"></i>
          </div>
          <span className="font-medium">Female</span>
          <div className="w-8 h-8 rounded-full bg-[#f7b797] flex justify-center items-center">
            <i className="bi bi-gender-male text-white"></i>
          </div>
          <span className="font-medium">Male</span>
        </div>
        <div className="flex gap-32 justify-start">
        <h1 className="font-bold text-black text-xl">50%</h1>
        <h1 className="font-bold text-black text-xl">80%</h1>
        </div>
      </div>
    </div>
  );
};

export default Gender;
