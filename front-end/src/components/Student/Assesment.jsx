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
        const response = await axios.get("http://localhost:8000/api/assessments/getvalue", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const scores = response.data;
        const goodValues = scores.filter((item) => item.value >= 75).length;
        const badValues = scores.filter((item) => item.value < 75).length;

        setSeries([
          { name: "Good Value", data: [goodValues], color: "#3b82f6" },
          { name: "Bad Value", data: [badValues], color: "#ef4444" },
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
        barHeight: "50%", // Pastikan tidak terlalu tinggi
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
      max:10
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontSize: "14px",
          fontWeight: 500,
        },
        offsetX: -10,
        offsetY: 2,
      },
    },
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
