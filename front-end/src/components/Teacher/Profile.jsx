import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(
          "http://localhost:8000/api/teacher",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <div className="bg-[#f5f2f0] w-full rounded-xl p-5 flex-[1] h-8/12 animate-pulse">
        <div className="rounded-xl overflow-hidden pt-5 h-24 w-24 mx-auto bg-gray-300"></div>
        <div className="w-full py-4">
          <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4 mx-auto"></div>
          <div className="flex gap-5 justify-center py-3">
            <div className="rounded-lg bg-gray-300 text-xs px-2 py-1.5 w-16 h-5"></div>
            <div className="rounded-lg bg-gray-300 text-xs px-2 py-1.5 w-24 h-5"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];
  const title = user.gender === "L" ? "Mr." : "Mrs.";
  const profileImage =
    user.gender === "L" ? "/student/boy.png" : "/student/girl.png";

  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-5 flex-[1] h-8/12">
      <div className="bg-white rounded-xl overflow-hidden pt-5">
        <img src={profileImage} alt="Profile" />
      </div>
      <div className="w-full py-4">
        <h1 className="font-semibold text-center text-sm text-slate-500">
          {title} {firstName}
        </h1>
        <h1 className="font-light text-center text-xs text-slate-400">
          {user.lesson} | {user.age} th
        </h1>
        <div className="flex gap-5 justify-center py-3">
          <div className="rounded-lg bg-blue-200/[0.3] text-xs px-2 text-slate-800 py-1.5">
            ID : {user.id}
          </div>
          <div className="rounded-lg bg-blue-500/[0.3] text-xs px-2 text-slate-800 py-1.5">
            {user.phone}
          </div>
        </div>
        <div className="text-[10px] text-center px-2 text-slate-800 w-full">
          {user.email}
        </div>
      </div>
    </div>
  );
};

export default Profile;
