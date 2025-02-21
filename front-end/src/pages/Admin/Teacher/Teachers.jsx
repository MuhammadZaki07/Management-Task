import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import Modal from "../../../components/Modal";
import Create from "../Teacher/Create";
import Edit from "../Teacher/Edit";

const Teachers = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const [sortOrder, setSortOrder] = useState("asc");
  const [teacherFilter, setTeacherFilter] = useState("All");

  const data = useMemo(
    () => [
      {
        id: 1,
        teacherName: "Erika Putri",
        genderAge: "Female | 50 th",
        telephone: "083846871126",
        email: "erika@gmail.com",
        teacherOf: "RPL",
      },
      {
        id: 2,
        teacherName: "John Doe",
        genderAge: "Male | 40 th",
        telephone: "082233445566",
        email: "johndoe@example.com",
        teacherOf: "Mathematics",
      },
      {
        id: 3,
        teacherName: "Alice Smith",
        genderAge: "Female | 35 th",
        telephone: "081234567890",
        email: "alice@gmail.com",
        teacherOf: "Science",
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (teacherFilter === "All") return data;
    return data.filter((item) => item.teacherOf === teacherFilter);
  }, [data, teacherFilter]);

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <input
            type="checkbox"
            className="w-5 h-5 appearance-auto border border-slate-300 rounded checked:bg-orange-500 checked:border-white"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows(new Set(filteredData.map((row) => row.id)));
              } else {
                setSelectedRows(new Set());
              }
            }}
            checked={selectedRows.size === filteredData.length}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="w-4 h-4 appearance-auto border border-slate-300 rounded checked:bg-orange-500 checked:border-white"
            checked={selectedRows.has(row.original.id)}
            onChange={(e) => {
              const newSelectedRows = new Set(selectedRows);
              if (e.target.checked) {
                newSelectedRows.add(row.original.id);
              } else {
                newSelectedRows.delete(row.original.id);
              }
              setSelectedRows(newSelectedRows);
            }}
          />
        ),
      },
      {
        accessorKey: "teacherName",
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
    [selectedRows, filteredData]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  return (
    <div className="px-16">
      <div className="flex justify-between items-center py-7">
        <div className="flex flex-col gap-3">
          <h1 className="font-bold text-4xl text-worn">Teachers</h1>
          <p className="font-normal text-slate-500">
            Manage teacher data with filters and sorting.
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-4 mt-8 items-center">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="bg-green-500 hover:bg-green-400 text-white font-medium rounded-lg py-2 px-5 flex items-center gap-2"
          >
            Import{" "}
            <i className="bi bi-file-earmark-spreadsheet text-white text-lg"></i>
          </button>
          <div className="w-10 h-10 rounded-full flex justify-center items-center border border-yellow-500 p-2 cursor-pointer hover:bg-yellow-100">
            <i className="bi bi-pencil text-yellow-500 text-lg"></i>
          </div>
          <div className="w-10 h-10 rounded-full flex justify-center items-center border border-red-500 p-2 cursor-pointer hover:bg-red-100">
            <i className="bi bi-trash text-red-500 text-lg"></i>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border border-slate-500/[0.5] bg-white font-normal focus:outline-none px-5 py-1.5 rounded-md"
          />
          <select
            value={teacherFilter}
            onChange={(e) => setTeacherFilter(e.target.value)}
            className="border border-gray-300 py-2 px-4 rounded-md focus:outline-none bg-white"
          >
            <option value="All">All Subjects</option>
            <option value="RPL">RPL</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
          </select>

          <button
            onClick={() => {
              const newOrder = sortOrder === "asc" ? "desc" : "asc";
              setSortOrder(newOrder);
              setSorting([{ id: "teacherName", desc: newOrder === "desc" }]);
            }}
            className="border border-gray-300 py-2 px-4 rounded-md focus:outline-none bg-white"
          >
            {sortOrder === "asc" ? "Sort: A-Z" : "Sort: Z-A"}
          </button>

          <button
            onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="bg-orange-500 cursor-pointer hover:bg-orange-300 text-white font-semibold rounded-lg py-2 px-4"
          >
            Create
          </button>
        </div>
      </div>
      <table className="min-w-full border-collapse mt-7">
        <thead className="bg-white text-orange-300 font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="p-3 text-left border-b border-slate-300"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={index % 2 === 0 ? "bg-slate-100" : "bg-white"}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="p-4 border-b border-slate-500/[0.5] font-light"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500 font-semibold text-xl"
              >
                Data tidak ditemukan
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {modalState.isOpen && (
        <Modal
          isOpen={modalState.isOpen}
          setOpen={setModalState}
          mode={modalState.mode}
        >
          {modalState.mode === "create" ? <Create /> : <Edit />}
        </Modal>
      )}
    </div>
  );
};

export default Teachers;
