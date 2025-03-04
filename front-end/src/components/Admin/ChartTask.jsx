import  { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ChartTask = () => {
  const { token } = useContext(AuthContext);
  const [chartData, setChartData] = useState({
    series: [
      { name: "Laki-laki", data: [0, 0, 0, 0, 0, 0] },
      { name: "Perempuan", data: [0, 0, 0, 0, 0, 0] },
    ],
    categories: ["2025", "2026", "2027", "2028", "2029", "2030"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/students-per-year",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;

        setChartData({
          series: [
            {
              name: "Man",
              data: Object.values(data).map((year) => year.male),
            },
            {
              name: "Girl",
              data: Object.values(data).map((year) => year.female),
            },
          ],
          categories: Object.keys(data),
        });
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-10 space-y-5 flex-[3]">
      <h1 className="font-semibold text-2xl text-[#5b6087]">
      Number of Students per Year
      </h1>
      <ReactApexChart
        options={{
          chart: { type: "bar", height: 350 },
          colors: ["#5b6087", "#f7b797"],
          plotOptions: {
            bar: {
              horizontal: false,
              columnWidth: "12%",
              borderRadius: 5,
            },
          },
          xaxis: {
            categories: chartData.categories,
          },
          yaxis: { title: { text: "Number Of Students" } },
          fill: { opacity: 1 },
          legend: { position: "top" },
          grid: { padding: { left: 10, right: 10 } },
          dataLabels: { enabled: false },
        }}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ChartTask;
