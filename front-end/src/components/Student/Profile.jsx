import { useEffect, useState } from "react";
import Assesment from "./Assesment";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/profile",{
          headers : {
            Authorization : `Bearer ${localStorage.getItem("token")}`
          }
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);
  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-5 flex-[1]">
      <div className="bg-white rounded-xl overflow-hidden pt-5">
        <img src="/student/boy.png" alt="Profile" />
      </div>
      <div className="w-full py-4">
        <h1 className="font-semibold text-center text-sm text-slate-500">
          {profile.name}
        </h1>
        <h1 className="font-light text-center text-xs text-slate-400">
          {profile.department} | {profile.class.class_name}
        </h1>
        <div className="flex gap-5 justify-center py-3">
          <div className="rounded-lg bg-blue-200/[0.3] text-xs px-2 text-slate-800 py-1.5">
            {profile.age} Th
          </div>
          <div className="rounded-lg bg-blue-500/[0.3] text-xs px-2 text-slate-800 py-1.5">
            {profile.email}
          </div>
        </div>
        <Assesment />
      </div>
    </div>
  );
};

export default Profile;
