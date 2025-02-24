const Profile = () => {
  return (
    <div className="bg-[#f5f2f0] w-full rounded-xl p-5 flex-[1] h-8/12">
        <div className="bg-white rounded-xl overflow-hidden pt-5">
            <img src="/student/girl.png" alt="" />
        </div>
        <div className="w-full py-4">
            <h1 className="font-semibold text-center text-sm text-slate-500">Mrs. Ira</h1>
            <h1 className="font-light text-center text-xs text-slate-400">Bahasa Indonesia | 50 th</h1>
            <div className="flex gap-5 justify-center py-3">
                <div className="rounded-lg bg-blue-200/[0.3] text-xs px-2 text-slate-800 py-1.5">00231654</div>
                <div className="rounded-lg bg-blue-500/[0.3] text-xs px-2 text-slate-800 py-1.5">03587</div>
            </div>
        </div>
    </div>
  )
}

export default Profile