import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import Modal from "./Modal";

const TableComponent = ({ data, columns, title, Create, Edit }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [modalState, setModalState] = useState({ isOpen: false, mode: "" });
  const [sortOrder, setSortOrder] = useState("asc");

  const columnsWithCheckbox = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          className="w-5 h-5 appearance-auto border border-slate-300 rounded checked:bg-orange-500 checked:border-white"
          onChange={(e) => {
            const checked = e.target.checked;
            setSelectedRows(
              checked ? new Set(data.map((row) => row.id)) : new Set()
            );
          }}
          checked={selectedRows.size > 0 && selectedRows.size === data.length}
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
    ...columns,
  ];

  const table = useReactTable({
    data,
    columns: columnsWithCheckbox,
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
          <h1 className="font-bold text-4xl text-worn">{title}</h1>
          <p className="font-normal text-slate-500">
            Manage data with filters and sorting.
          </p>
        </div>
      </div>
      <div className="flex justify-between gap-4 mt-8 items-center">
        <div className="flex items-center gap-5">
          <button
            onClick={() => setModalState({ isOpen: true, mode: "create" })}
            className="bg-green-500 hover:bg-green-400 text-white font-medium rounded-lg py-2 px-5 flex items-center gap-2 cursor-pointer"
          >
            Import{" "}
            <i className="bi bi-file-earmark-spreadsheet text-white text-lg"></i>
          </button>
          <button
            disabled={selectedRows.size === 0}
            onClick={() => {
              if (selectedRows.size > 0) {
                setModalState({ isOpen: true, mode: "edit" });
              }
            }}
            className={`w-12 h-12 rounded-full flex justify-center items-center border-2 border-yellow-500 p-2 ${
              selectedRows.size > 0
                ? "hover:bg-yellow-100"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <i className="bi bi-pencil text-yellow-500 text-lg"></i>
          </button>

          <button
            disabled={selectedRows.size === 0}
            onClick={() => console.log("Delete data:", [...selectedRows])}
            className={`w-12 h-12 rounded-full flex justify-center items-center border-2 border-red-500 p-2 ${
              selectedRows.size > 0
                ? "hover:bg-red-100"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <i className="bi bi-trash text-red-500 text-lg"></i>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="border border-slate-500/[0.5] bg-white font-normal focus:outline-none px-5 py-1.5 rounded-md"
          />
          <button
            onClick={() => {
              const newOrder = sortOrder === "asc" ? "desc" : "asc";
              setSortOrder(newOrder);
              setSorting([{ id: "name", desc: newOrder === "desc" }]);
            }}
            className="border border-gray-300 py-2 px-4 rounded-md focus:outline-none bg-white"
          >
            {sorting.length > 0 && sorting[0].desc ? "Sort: Z-A" : "Sort: A-Z"}
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

TableComponent.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  Edit: PropTypes.elementType.isRequired,
  Create: PropTypes.elementType.isRequired,
};

export default TableComponent;
