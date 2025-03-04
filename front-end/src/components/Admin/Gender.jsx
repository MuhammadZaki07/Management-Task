import { useContext, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Gender = () => {
  const [chartData, setChartData] = useState({ male: 0, female: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/gender-statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        const male = data.find((item) => item.gender === "L")?.percentage || 0;
        const female =
          data.find((item) => item.gender === "P")?.percentage || 0;
        const total = response.data.total;
        setChartData({ male, female, total });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teacher gender data:", error);
        setLoading(false);
      });
  }, []);

  const options = {
    series: [chartData.male, chartData.female],
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
            label: "total teachers",
            formatter: function () {
              return chartData.total;
            },
          },
        },
      },
    },
    labels: ["Teacher Male", "Teacher Female"],
    colors: ["#5b6087", "#f7b797"],
  };

  return (
    <div
      className={`bg-[#f5f2f0] w-full rounded-xl p-5 flex-[1] ${
        loading ? "animate-pulse" : ""
      }`}
    >
      {loading ? (
        <>
        
        <div className="h-44 flex items-center justify-center text-gray-500 font-semibold">
          Loading...
        </div>
          <div className="flex flex-col gap-3">
          <h1 className="font-semibold text-2xl text-[#5b6087] py-2 bg-slate-200 rounded-xl"></h1>
          <div className="flex gap-5 items-center justify-start py-3">
            <div className="w-8 h-8 rounded-full bg-[#5b6087] flex justify-center items-center">
              <i className="bi bi-gender-female text-white"></i>
            </div>
            <span className="font-medium"></span>
            <div className="w-8 h-8 rounded-full bg-[#f7b797] flex justify-center items-center">
              <i className="bi bi-gender-male text-white"></i>
            </div>
            <span className="font-medium"></span>
          </div>
          <div className="flex gap-32 justify-start">
            <div className="font-bold bg-slate-200 py-2 rounded-xl text-xl">
             
            </div>
            <div className="font-bold bg-slate-200 py-2 rounded-xl text-xl">
              
            </div>
          </div>
        </div>
        </>
      ) : (
        <>
          <ReactApexChart
            options={options}
            series={options.series}
            type="radialBar"
            height={350}
          />
          <div className="flex flex-col gap-3">
            <h1 className="font-semibold text-2xl text-[#5b6087]">Teacher</h1>
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
              <h1 className="font-bold text-black text-xl">
                {chartData.female}%
              </h1>
              <h1 className="font-bold text-black text-xl">
                {chartData.male}%
              </h1>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Gender;
