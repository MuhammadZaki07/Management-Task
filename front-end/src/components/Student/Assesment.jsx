import ReactApexChart from "react-apexcharts";

const Assesment = () => {
  const series = [
    {
      name: "Good Value",
      data: [12, 0], // Tambahkan data kosong agar ada ruang
      color: "#3b82f6",
    },
    {
      name: "Bad Value",
      data: [0, 8], // Tambahkan data kosong agar ada ruang
      color: "#ef4444",
    },
  ];

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
        barGap: 50
      },
    },
    dataLabels: {
      enabled: false,
    },
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
