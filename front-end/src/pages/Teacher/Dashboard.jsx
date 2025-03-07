import Calendar from "../../components/Calender";
import ChartTask from "../../components/Teacher/ChartTask";
import Profile from "../../components/Teacher/Profile";
import TodoList from "../../components/TodoList";

const DashboardTeacher = () => {
  return (
    <div className="flex">
      <div className="container py-10 px-10">
        <div className="flex w-full gap-5 mt-5">
          <ChartTask />
          <Profile />
        </div>
      </div>
      <div className="bg-[#f5f2f0] h-screen w-4/12 px-8 py-10 flex flex-col gap-20">
        <Calendar />
        <TodoList />
      </div>
    </div>
  );
};

export default DashboardTeacher;
