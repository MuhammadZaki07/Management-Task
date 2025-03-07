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
          text: "Tasks Completed",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/completed-tasks",{
          headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        });
        const taskData = response.data;
        
        const categories = taskData.map(task => task.date);
        const seriesData = [{
          name: "Completed Tasks",
          data: taskData.map(task => task.count),
        }];

        setState(prevState => ({
          ...prevState,
          series: seriesData,
          options: {
            ...prevState.options,
            xaxis: { categories },
          },
        }));
      } catch (error) {
        console.error("Error fetching task data", error);
      }
    };

    fetchData();
  }, []);

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
