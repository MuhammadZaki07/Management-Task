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

  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-5 flex-[1]">
      <div>
        <img src={`${profile.gender === "P" ? "/student/girl.gif" : "/student/boy.gif"}`} alt="Profile" className="w-full object-cover rounded-lg "/>
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
