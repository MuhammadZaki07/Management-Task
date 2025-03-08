import { useState, useEffect } from "react";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";

const DataPtk = () => {
  const [teachers, setTeachers] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [lessonFilter, setLessonFilter] = useState("");
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);

  const getDataTeacher = async () => {
    setLoading(true)
    axios
      .get("http://localhost:8000/api/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setTeachers(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teachers:", error);
      });
  };
  const getDataLessons = async () => {
    setLoading(true)
    axios
      .get("http://localhost:8000/api/lessons", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setLessons(response.data.data);
    setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching lessons:", error);
      });
  };
  useEffect(() => {
    getDataLessons();
    getDataTeacher();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (lessonFilter === "" || teacher.lesson_id == lessonFilter)
  );

  if(loading){
    return (
      <LoadingPage/>
    )
  }

  return (
    <div className="w-full px-16 py-10">
      <div className="flex flex-col gap-2 mb-5">
        <h1 className="text-4xl text-salt font-bold">Teachers Data</h1>
        <p className="text-slate-500 text-sm font-normal">
          This table provides a list of teachers along with their assigned
          subjects and contact information.
        </p>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 bg-white rounded-lg border-slate-300/[0.5] focus:outline-none"
        />
        <select
          value={lessonFilter}
          onChange={(e) => setLessonFilter(e.target.value)}
          className="border px-4 py-2 bg-white rounded-lg border-slate-300/[0.5] focus:outline-none"
        >
          <option value="">All Subjects</option>
          {lessons.map((lesson) => (
            <option key={lesson.id} value={lesson.id}>
              {lesson.name}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full">
        <thead className="bg-white text-slate-500 font-semibold text-left">
          <tr className="h-12">
            <th className="px-4 py-2">No</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Subject</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">WhatsApp Number</th>
          </tr>
        </thead>
        <tbody className="text-left">
          {filteredTeachers.map((teacher, index) => (
            <tr
              key={teacher.id}
              className="h-12 bg-white text-base font-light odd:bg-slate-100 border-b border-slate-300/[0.5]"
            >
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                <div className="flex gap-4">
                  <img
                    src="/assets/profile.png"
                    className="w-10 h-10 rounded-full"
                    alt={teacher.user.name}
                  />
                  <h1>{teacher.user.name}</h1>
                </div>
              </td>
              <td className="px-4 py-2">
                {lessons.find((lesson) => lesson.id === teacher.lesson_id)
                  ?.name || "-"}
              </td>
              <td className="px-4 py-2">{teacher.user.email}</td>
              <td className="px-4 py-2">{teacher.user.no_tlp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataPtk;
