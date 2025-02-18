function ScheduleTable() {
  const schedule = {
    Monday: [
      {
        time: "07:30-08:10",
        subject: "Matematika - Aljabar",
        teacher: "Mr. Andi",
        class: "A-21",
      },
      {
        time: "08:10-08:50",
        subject: "Bahasa Indonesia - Puisi",
        teacher: "Ms. Sari",
        class: "A-22",
      },
      {
        time: "08:50-09:30",
        subject: "Fisika - Gaya",
        teacher: "Mr. Budi",
        class: "A-23",
      },
      {
        time: "09:30-10:10",
        subject: "Bahasa Inggris - Vocabulary",
        teacher: "Ms. Wulan",
        class: "A-24",
      },
      {
        time: "10:10-10:50",
        subject: "Matematika - Statistik",
        teacher: "Mr. Surya",
        class: "A-25",
      },
      {
        time: "10:50-11:30",
        subject: "Fisika - Optik",
        teacher: "Mr. Budi",
        class: "A-26",
      },
      {
        time: "12:30-13:10",
        subject: "Kimia - Reaksi",
        teacher: "Ms. Tika",
        class: "A-27",
      },
      {
        time: "13:10-13:50",
        subject: "Biologi - Genetika",
        teacher: "Mr. Hadi",
        class: "A-28",
      },
      {
        time: "14:00-14:40",
        subject: "Ekonomi - Mikro",
        teacher: "Ms. Lia",
        class: "A-29",
      },
      {
        time: "14:40-15:15",
        subject: "Sejarah - Revolusi",
        teacher: "Mr. Fajar",
        class: "A-30",
      },
    ],
    Tuesday: [
      {
        time: "07:30-08:10",
        subject: "Kimia - Larutan",
        teacher: "Ms. Tika",
        class: "A-31",
      },
      {
        time: "08:10-08:50",
        subject: "Sejarah - Perang Dunia",
        teacher: "Mr. Fajar",
        class: "A-32",
      },
      {
        time: "08:50-09:30",
        subject: "Geografi - Peta",
        teacher: "Ms. Rina",
        class: "A-33",
      },
      {
        time: "09:30-10:10",
        subject: "Biologi - Anatomi",
        teacher: "Mr. Hadi",
        class: "A-34",
      },
      {
        time: "10:10-10:50",
        subject: "Matematika - Geometri",
        teacher: "Mr. Surya",
        class: "A-35",
      },
      {
        time: "10:50-11:30",
        subject: "Bahasa Inggris - Speaking",
        teacher: "Ms. Wulan",
        class: "A-36",
      },
      {
        time: "12:30-13:10",
        subject: "Fisika - Termodinamika",
        teacher: "Mr. Budi",
        class: "A-37",
      },
      {
        time: "13:10-13:50",
        subject: "Seni - Lukisan",
        teacher: "Ms. Sinta",
        class: "A-38",
      },
      {
        time: "14:00-14:40",
        subject: "Pendidikan Agama - Fiqih",
        teacher: "Ms. Fitri",
        class: "A-39",
      },
      {
        time: "14:40-15:15",
        subject: "Olahraga - Renang",
        teacher: "Mr. Rendy",
        class: "A-40",
      },
    ],
    Wednesday: [
      {
        time: "07:30-08:10",
        subject: "Biologi - Sel",
        teacher: "Mr. Hadi",
        class: "A-41",
      },
      {
        time: "08:10-08:50",
        subject: "Ekonomi - Pasar",
        teacher: "Ms. Lia",
        class: "A-42",
      },
      {
        time: "08:50-09:30",
        subject: "Sosiologi - Masyarakat",
        teacher: "Mr. Dika",
        class: "A-43",
      },
      {
        time: "09:30-10:10",
        subject: "Matematika - Aljabar",
        teacher: "Mr. Surya",
        class: "A-44",
      },
      {
        time: "10:10-10:50",
        subject: "Kimia - Polimer",
        teacher: "Ms. Tika",
        class: "A-45",
      },
      {
        time: "10:50-11:30",
        subject: "Bahasa Indonesia - Sastra",
        teacher: "Ms. Sari",
        class: "A-46",
      },
      {
        time: "12:30-13:10",
        subject: "Fisika - Gerak",
        teacher: "Mr. Budi",
        class: "A-47",
      },
      {
        time: "13:10-13:50",
        subject: "Geografi - Cuaca",
        teacher: "Ms. Rina",
        class: "A-48",
      },
      {
        time: "14:00-14:40",
        subject: "Sejarah - Kolonialisme",
        teacher: "Mr. Fajar",
        class: "A-49",
      },
      {
        time: "14:40-15:15",
        subject: "Olahraga - Sepakbola",
        teacher: "Mr. Rendy",
        class: "A-50",
      },
    ],
  };
  return (
    <div className="py-10 px-16">
      <div className="flex flex-col gap-2 mb-5">
        <h1 className="text-4xl text-salt font-bold">Data PTK</h1>
        <p className="text-slate-500 text-sm font-normal">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, magnam!
        </p>
      </div>
      {Object.entries(schedule).map(([day, lessons]) => (
        <div key={day} className="table w-full mb-5">
          <div className="bg-orange-200 w-full py-2 px-10">
            <h1 className="text-3xl font-bold text-slate-800">{day}</h1>
          </div>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-50 text-lg text-center font-semibold text-[#fc691f]">
                <th className="w-[20%] py-2.5 border-b border-slate-500">
                  Time
                </th>
                <th className="w-[40%] py-2.5 border-b border-slate-500">
                  Subject
                </th>
                <th className="w-[20%] py-2.5 border-b border-slate-500">
                  Class Room
                </th>
                <th className="w-[20%] py-2.5 border-b border-slate-500">
                  Teaching Teacher
                </th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson, index) => (
                <tr
                  key={index}
                  className="odd:bg-slate-100 text-[#464444] text-center"
                >
                  <td className="w-[20%] py-3 border-b border-slate-500 px-3">
                    {lesson.time}
                  </td>
                  <td className="w-[40%] py-3 border-b border-slate-500 px-3">
                    {lesson.subject}
                  </td>
                  <td className="w-[20%] py-3 border-b border-slate-500 px-3">
                    {lesson.class}
                  </td>
                  <td className="w-[20%] py-3 border-b border-slate-500 px-3">
                    {lesson.teacher}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default ScheduleTable;
