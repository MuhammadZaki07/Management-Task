import React from "react";
import ReactApexChart from "react-apexcharts";

const ChartTask = () => {
  const [state, setState] = React.useState({
    series: [
      {
        name: "Net Profit",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Revenue",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
      {
        name: "Zaki",
        data: [81, 85, 10, 49, 87, 80, 76, 120, 70],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      colors: ["#5b6087", "#f7b797"],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "30%",
          borderRadius: 5,
          borderRadiusApplication: "end",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },
      yaxis: {
        title: {
          text: "$ (thousands)",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands";
          },
        },
      },
    },
  });
  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-10 space-y-5 flex-[3]">
      <h1 className="font-semibold text-2xl text-[#5b6087]">Completed task</h1>
      <ReactApexChart
        options={state.options}
        series={state.series}
        type="bar"
        height={450}
      />
    </div>
  );
};

export default ChartTask;
