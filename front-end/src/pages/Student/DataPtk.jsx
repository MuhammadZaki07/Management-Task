const DataPtk = () => {
    const teachers = [
        { id: 1, name: "Sri Muliani", position: "Teacher", phone: "083846871126" },
        { id: 2, name: "Budi Santoso", position: "Math Teacher", phone: "081234567890" },
        { id: 3, name: "Ani Wulandari", position: "Science Teacher", phone: "081298765432" },
        { id: 4, name: "Dewi Kartika", position: "History Teacher", phone: "085678912345" },
        { id: 5, name: "Rudi Hartono", position: "PE Teacher", phone: "082345678901" },
        { id: 6, name: "Lestari Dewanti", position: "English Teacher", phone: "081234567891" },
        { id: 7, name: "Joko Supriyono", position: "Physics Teacher", phone: "087654321098" },
        { id: 8, name: "Wahyu Prasetyo", position: "Chemistry Teacher", phone: "089876543210" },
        { id: 9, name: "Siti Aisyah", position: "Biology Teacher", phone: "082198765432" },
        { id: 10, name: "Doni Saputra", position: "Geography Teacher", phone: "081234123456" },
        { id: 11, name: "Fadli Rahman", position: "Music Teacher", phone: "085678901234" },
        { id: 12, name: "Citra Permata", position: "Art Teacher", phone: "081345678912" },
        { id: 13, name: "Ahmad Fauzan", position: "Religious Studies", phone: "089876543211" },
        { id: 14, name: "Sulastri Handayani", position: "Civics Teacher", phone: "082234567890" },
        { id: 15, name: "Bayu Firmansyah", position: "Sociology Teacher", phone: "081256789012" },
        { id: 16, name: "Ratna Kumala", position: "Economics Teacher", phone: "083345678901" },
        { id: 17, name: "Rangga Putra", position: "IT Teacher", phone: "082167890123" },
        { id: 18, name: "Tina Maharani", position: "Drama Teacher", phone: "081234098765" },
        { id: 19, name: "Zainal Arifin", position: "Language Teacher", phone: "089098765432" },
        { id: 20, name: "Lina Susanti", position: "Counselor", phone: "082345678912" },
      ];
    return (
      <div className="w-full px-16 py-10">
        <div className="flex flex-col gap-2 mb-5">
          <h1 className="text-4xl text-salt font-bold">Data PTK</h1>
          <p className="text-slate-500 text-sm font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, magnam!
          </p>
        </div>
        <table className="w-full">
          <thead className="bg-white text-slate-500 font-semibold text-left">
            <tr className="h-12">
              <th className="px-4 py-2">No</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Jabatan</th>
              <th className="px-4 py-2">No WhatsApp</th>
            </tr>
          </thead>
          <tbody className="text-left">
            {teachers.map((item,index) => (
            <tr key={item.id} className="h-12 bg-white text-base font-light odd:bg-slate-100 border-b border-slate-300/[0.5]">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                <div className="flex gap-4">
                <img src="/assets/profile.png" className="w-10 h-10 rounded-full" alt={item.name} />
                <h1>{item.name}</h1>
                </div>
              </td>
              <td className="px-4 py-2">{item.position}</td>
              <td className="px-4 py-2">{item.phone}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default DataPtk;
  