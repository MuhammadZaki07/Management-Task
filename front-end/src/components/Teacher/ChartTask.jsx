import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const ChartTask = () => {
  const [state, setState] = useState({
    series: [],
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
        categories: [],
      },
      yaxis: {
        title: {
          text: "Total Tasks",
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " tasks";
          },
        },
      },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          "http://localhost:8000/api/tasks/teacher/chart",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = response.data;
        const categories = data.map((item) => item.date); // Pakai format tanggal
        const seriesData = data.map((item) => item.total_tasks);

        setState((prevState) => ({
          ...prevState,
          series: [{ name: "Total Tasks", data: seriesData }],
          options: { ...prevState.options, xaxis: { categories } },
        }));
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 w-full rounded-xl p-10 space-y-5 flex-[3] animate-pulse">
        <div className="bg-slate-400 w-1/2 h-5 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-10 space-y-5 flex-[3]">
      <h1 className="font-semibold text-2xl text-[#5b6087]">Task Overview</h1>
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
