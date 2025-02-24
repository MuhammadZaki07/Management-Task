import CardAdmin from "../../components/Admin/CardAdmin";
import ChartTask from "../../components/Admin/ChartTask";
import Gender from "../../components/Admin/Gender";
import Calendar from "../../components/Calender";
import TodoList from "../../components/TodoList";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="container py-10 px-10">
        <CardAdmin />
        <div className="flex w-full gap-5 mt-5">
          <ChartTask />
          <Gender />
        </div>
      </div>
      <div className="bg-[#f5f2f0] h-screen w-4/12 px-8 py-10 flex flex-col gap-20">
        <Calendar />
        <TodoList />
      </div>
    </div>
  );
};

export default Dashboard;
