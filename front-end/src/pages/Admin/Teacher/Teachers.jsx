import { useState, useMemo } from "react";
import Table from "../../../components/TableCompoenent";
import Create from "./Create"
import Edit from "./Edit"

const Teachers = () => {
  const [teacherFilter, setTeacherFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState(new Set());

  const data = [
    { id: 1, name: "Erika Putri", genderAge: "Female | 50 th", telephone: "083846871126", email: "erika@gmail.com", teacherOf: "RPL" },
    { id: 2, name: "John Doe", genderAge: "Male | 40 th", telephone: "082233445566", email: "johndoe@example.com", teacherOf: "Mathematics" },
    { id: 3, name: "Alice Smith", genderAge: "Female | 35 th", telephone: "081234567890", email: "alice@gmail.com", teacherOf: "Science" },
  ];
  
  const filteredData = useMemo(() => {
    if (teacherFilter === "All") return data;
    return data.filter((item) => item.teacherOf === teacherFilter);
  }, [teacherFilter]); // Tidak perlu data dalam dependensi
  

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Teacher Name",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "genderAge",
        header: "Gender & Age",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "telephone",
        header: "Telephone",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "teacherOf",
        header: "Teacher Of",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );
  

  return (
    <div>
      <Table data={filteredData} columns={columns} Edit={Edit} Create={Create} title="Teachers" />
    </div>
  );
};

export default Teachers;
