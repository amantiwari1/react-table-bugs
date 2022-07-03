import React, { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

interface CellProps {
  table: any
  column: any
  row: any
  cell: any
  getValue: () => any
  renderValue: () => any
}

import { useParam, useRouter } from "blitz"

export const pCell = ({ getValue }: CellProps) => <p>{getValue()}</p>

// Define a default UI for filtering
function GlobalFilter({ count }: { count: number }) {
  const router = useRouter()
  const { pathname, query } = router

  const [value, setValue] = React.useState(query.search)

  const onSearch = () =>
    router.push({
      pathname,
      query: {
        ...query,
        search: value,
        page: 0,
      },
    })

  return (
    <div className="flex items-center gap-2 w-full m-2">
      <label className="w-full ">
        <input
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              onSearch()
            }
          }}
          type="p"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value)
          }}
          placeholder={`Search ${count} records...`}
        />
      </label>
      <button onClick={onSearch}>Search</button>
    </div>
  )
}

export const ClientNameCell = ({ getValue, row }: CellProps) => {
  return (
    <div>
      <a className="p-lg font-bold">{getValue()}</a>
    </div>
  )
}

export const StatusCaseDashboardCell = ({ getValue }: CellProps) => (
  <p>{getValue() ?? "Pending case status"}</p>
)
export const BankNameCell = ({ getValue }: CellProps) => <p>{getValue() ?? "No Selected Bank"}</p>
export const DateCell = ({ getValue }: CellProps) => <p>{new Date(getValue()).toDateString()}</p>
export const NumberCell = ({ getValue }: CellProps) => (
  <p> ₹{parseInt(getValue().toString()).toLocaleString("hi")}</p>
)
export const DownloadCell = ({ getValue }: CellProps) => {
  return (
    <>
      {getValue()?.name ? (
        <button onClick={async () => {}}>
          {getValue().name.substring(0, 6)}...{getValue().name.split(".").at(-1)}
        </button>
      ) : (
        <p>No Upload file</p>
      )}
    </>
  )
}

function download(url: string, filename: string) {
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = filename
      link.click()
    })
    .catch(console.error)
}
const DownloadButton = ({
  name,
  keys,
  id,
  fileType,
}: {
  name: string
  keys: string
  id: number
  fileType: string
}) => {
  const enquiryId = useParam("enquiryId", "number")

  return (
    <div>
      <button onClick={async () => {}}>
        {name.substring(0, 6)}...{fileType}
      </button>
      <button />
    </div>
  )
}

export const onRefreshDocumentData = async (enquiryId: number | undefined) => {}
interface fileProps {
  name: string
  id: number
  fileType: string
  key: string
  relation_name: string
}
export const DownloadMultiCell = ({
  value,
  name,
  id,
  relationName,
}: {
  value: fileProps[]
  name: string
  id: number
  relationName: string
}) => {
  const enquiryId = useParam("enquiryId", "number") as number
  const [isUploading, setIsUploading] = useState(false)

  return (
    <div className="space-y-2 w-32">
      {isUploading && (
        <div className="flex justify-center">
          <div />
        </div>
      )}
      <div>
        {value && value.length ? (
          <div className="space-y-2">
            {value.map((arr, key) => (
              <div key={key}>
                <DownloadButton
                  fileType={arr.fileType}
                  id={arr.id}
                  name={arr.name}
                  keys={arr.key}
                />
              </div>
            ))}
          </div>
        ) : (
          <input
            multiple
            type="file"
            accept=".doc,.docx,.pdf,.txt,.xls,.csv,.xlsx"
            className="w-full  mx-auto max-w-sm block p-white
          file:mr-4 file:py-1 file:px-4
          file:rounded-md file:border-0
          file:outline-blue-900
          file:p-sm 
          file:bg-blue-50 file:p-white
          hover:file:bg-blue-100
          "
          />
        )}
      </div>
    </div>
  )
}

interface CreateButtonTableProps {
  onClick: () => void
  allowRoles: string[]
  title: string
  session: {
    role: string
  }
}

export const CreateButtonTable = ({
  onClick,
  session,
  allowRoles,
  title,
}: CreateButtonTableProps) => {
  return (
    <div>
      {allowRoles.includes(session.role as string) && <button onClick={onClick}>{title}</button>}
    </div>
  )
}
export const StatusPillCell = ({ getValue }: CellProps) => {
  return <p>{getValue()?.id ? new Date(getValue().updatedAt).toString() : "No Upload file"}</p>
}

interface TableProps {
  data: object[]
  columns: any[]
  title: string
  rightRender?: () => JSX.Element
  count: number
  hasMore: boolean
}

function Table({ columns, data, title, rightRender, count, hasMore }: TableProps) {
  const router = useRouter()
  const { pathname, query } = router

  const pageQuery = Number(query.page) || 0
  const take = Number(query.take) || 10

  const goTo = (number: number) =>
    router.push({
      pathname,
      query: {
        ...query,
        page: pageQuery + number,
      },
    })

  const [sorting, setSorting] = React.useState<SortingState>([])

  const tableReact = useReactTable({
    data: [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  // Render the UI for your table
  return (
    <div>
      <div className="mt-2">
        <div className="">
          <div className="py-2">
            {/* Title */}
            <div className="shadow border-b bg-white border-gray-200 sm:rounded-lg">
              <div className="flex justify-between items-center p-2 px-3">
                <p className="p-xl font-bold">{title}</p>
                {rightRender ? rightRender() : null}
              </div>

              {/* SEARCH */}
              <div className="flex gap-x-2">
                <GlobalFilter count={count} />
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto ">
                <table className="divide-y  w-full overflow-x-auto border-collapse  divide-gray-200">
                  <thead className="bg-blue-50 p-white">
                    {tableReact.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            colSpan={header.colSpan}
                            className="group border px-6 py-3 p-left p-xs font-medium  uppercase tracking-wider"
                          >
                            <div
                              className="flex items-center space-x-1"
                              {...{ onClick: header.column.getToggleSortingHandler() }}
                            >
                              <p>
                                {flexRender(header?.column?.columnDef?.header, header.getConp())}
                              </p>
                              <span>
                                {{
                                  asc: <div className="w-2 h-4 p-gray-400" />,
                                  desc: <div className="w-2 h-4 p-gray-400" />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <div className="w-2 h-4 p-gray-400 " />
                                )}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableReact.getRowModel().rows.map((row, i) => {
                      return (
                        <tr
                          className={
                            i % 2 === 0 ? "hover:bg-green-200" : "bg-green-50 hover:bg-green-200 "
                          }
                          key={row.id}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <td
                                key={cell.id}
                                className="px-6 py-1 border whitespace-nowrap"
                                role="cell"
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getConp())}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {/* NO DATA TABLE */}
                {tableReact.getRowModel().rows && tableReact.getRowModel().rows.length === 0 && (
                  <div>
                    <div>
                      <svg
                        className="h-32 w-32"
                        xmlns="http://www.w3.org/2000/svg"
                        data-name="Layer 1"
                        viewBox="0 0 32 32"
                      >
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M23.5,27.5H6.5l-1-15.19a.76.76,0,0,1,.77-.81H10a1.11,1.11,0,0,1,.89.44l1.22,1.56H23.5v2"
                        />
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M26.3,20.7l.84-3.2H9.25L6.5,27.5H23.41a1.42,1.42,0,0,0,1.37-1.06l.76-2.88"
                        />
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.5,24.5h0a1.42,1.42,0,0,1,2,0h0"
                        />
                        <line
                          x1="13.5"
                          x2="14.5"
                          y1="21.5"
                          y2="21.5"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="20.5"
                          x2="21.5"
                          y1="21.5"
                          y2="21.5"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.62,3.61C18.25,4,16.5,5.37,16.5,7a2.57,2.57,0,0,0,.7,1.7l-.7,2.8,2.86-1.43A8.12,8.12,0,0,0,22,10.5c3,0,5.5-1.57,5.5-3.5,0-1.6-1.69-2.95-4-3.37"
                        />
                        <line
                          x1="21.25"
                          x2="22.75"
                          y1="6.25"
                          y2="7.75"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="22.75"
                          x2="21.25"
                          y1="6.25"
                          y2="7.75"
                          fill="none"
                          stroke="#91b841"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1>No Data</h1>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="py-3 flex items-center justify-between">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="p-sm">Total: {count}</span>
            <span className="p-sm p-gray-700">
              Page <span className="font-medium">{pageQuery + 1}</span> of{" "}
              <span className="font-medium">{Math.round(count / take)}</span>
            </span>
          </div>
          <div>
            <nav aria-label="Pagination" className="flex gap-5">
              <button disabled={pageQuery === 0} onClick={() => goTo(-1)}>
                Previous
              </button>
              <button disabled={!hasMore} onClick={() => goTo(1)}>
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Table
