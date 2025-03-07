import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const Assesment = () => {
  const [series, setSeries] = useState([
    { name: "Good Value", data: [0], color: "#3b82f6" },
    { name: "Bad Value", data: [0], color: "#ef4444" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const belowResponse = await axios.get(
          "http://localhost:8000/api/tasks-student/scores?type=below",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const aboveResponse = await axios.get(
          "http://localhost:8000/api/tasks-student/scores?type=above",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSeries([
          { name: "Good Value", data: [aboveResponse.data.data.length], color: "#3b82f6" },
          { name: "Bad Value", data: [belowResponse.data.data.length], color: "#ef4444" },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    chart: {
      type: "bar",
      height: 300,
      width: "100%",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 5,
        barGap: 50,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Good Value", "Low Value"],
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { show: true } },
    grid: { show: false },
    legend: { show: false },
  };

  return (
    <div className="p-2">
      <ReactApexChart options={options} series={series} type="bar" height={130} />
    </div>
  );
};

export default Assesment;
