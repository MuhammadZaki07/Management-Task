import { useState, useEffect } from "react";
import axios from "axios";

const Assessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "bad", "good"

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/assessments/getvalue", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAssessments(response.data);
      } catch (error) {
        console.error("Error fetching assessments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 🔍 Filter values
  const filteredAssessments = assessments.filter((item) => {
    if (filter === "bad") return item.value < 75;
    if (filter === "good") return item.value >= 75;
    return true; // If "all", show all data
  });

  return (
    <div className="px-16 w-full">
      <div className="w-full px-16 py-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-4xl text-salt font-bold">Assessment Data</h1>
          <p className="text-slate-500 text-sm font-normal">
            List of scores from completed assignments.
          </p>
        </div>

        <div className="mb-4">
          <label className="text-slate-600 font-semibold mr-2">Filter:</label>
          <select
            className="border p-2 rounded-md"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Scores</option>
            <option value="bad">Bad Value</option>
            <option value="good">Good Value</option>
          </select>
        </div>

        <table className="w-full">
          <thead className="bg-white text-slate-500 font-semibold text-left">
            <tr className="h-12">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Task Name</th>
              <th className="px-4 py-2">Teacher Name</th>
              <th className="px-4 py-2">Subjects</th>
              <th className="px-4 py-2">Your Score</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((item, index) => (
                <tr
                  key={index + 1}
                  className="h-12 bg-white text-base font-light odd:bg-slate-100 border-b border-slate-300/[0.5]"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.task}</td>
                  <td className="px-4 py-2">{item.teacher}</td>
                  <td className="px-4 py-2">{item.lesson}</td>
                  <td
                    className={`px-4 py-2 flex gap-4 items-center font-semibold ${
                      item.value < 75 ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    <div className="flex gap-4">
                      {item.value < 75 ? (
                        <div className="w-5 h-5 rounded-full animate-pulse-fast bg-red-500"></div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    {item.value}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No data matches the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Assessment;
