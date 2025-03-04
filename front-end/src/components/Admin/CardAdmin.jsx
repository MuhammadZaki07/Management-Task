import { useContext, useEffect, useState } from "react";
import axios from "axios";
import CardDashboard from "./CardDashboard";
import { AuthContext } from "../../context/AuthContext";

const CardAdmin = () => {
  const { token } = useContext(AuthContext);
  const [counts, setCounts] = useState({
    students: 0,
    teachers: 0,
    lessons: 0,
    classes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, teachersRes, lessonsRes, classesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/students", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/teachers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/lessons", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:8000/api/classes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCounts({
          students: studentsRes.data.data.length,
          teachers: teachersRes.data.data.length,
          lessons: lessonsRes.data.data.length,
          classes: classesRes.data.data.length,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
        <div className="grid grid-cols-4 gap-5">
          <CardDashboard title="Students" count={0} logo="bi-people-fill" loading={loading} />
          <CardDashboard title="Teachers" count={0} logo="bi-person-workspace" loading={loading} />
          <CardDashboard title="Lessons" count={0} logo="bi-journal-text" loading={loading} />
          <CardDashboard title="Class" count={0} logo="bi-building" loading={loading} />
        </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-5 p-2 w-full">
      <CardDashboard title="Students" count={counts.students} logo="bi-people-fill" />
      <CardDashboard title="Teachers" count={counts.teachers} logo="bi-person-workspace" />
      <CardDashboard title="Lessons" count={counts.lessons} logo="bi-journal-text" />
      <CardDashboard title="Class" count={counts.classes} logo="bi-building" />
    </div>
  );
};

export default CardAdmin;
