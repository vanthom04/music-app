"use client"

import * as React from "react"
import {
  Row,
  ColumnDef,
  PaginationState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table"
import {
  Trash2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { useConfirm } from "@/hooks/use-confirm"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectValue,
  SelectItem,
  SelectTrigger,
  SelectContent
} from "@/components/ui/select"

interface DataTableProps<TData, TValue> {
  data: TData[]
  disabled?: boolean
  columns: ColumnDef<TData, TValue>[]
  searchKey: string
  onDelete: (rows: Row<TData>[]) => void
}

export const DataTable = <TData, TValue>({
  data,
  columns,
  disabled,
  searchKey,
  onDelete
}: DataTableProps<TData, TValue>) => {
  const [ConfirmDialog, confirm] = useConfirm({
    title: "Are you sure?",
    message: "You are about to perform a bulk delete."
  })

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [paginationTable, setPaginationTable] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const table = useReactTable({
    data,
    columns,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPaginationTable,
    state: {
      rowSelection,
      columnFilters,
      pagination: paginationTable
    }
  })

  return (
    <div>
      <ConfirmDialog />
      <div className="flex items-center pb-2">
        <Input
          name="filter-search"
          className="max-w-sm"
          placeholder={`Search ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
        />
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            disabled={disabled}
            className="ml-auto h-9 font-normal hover:text-rose-500"
            onClick={async () => {
              const ok = await confirm()

              if (ok) {
                onDelete(table.getFilteredSelectedRowModel().rows)
                table.resetRowSelection()
              }
            }}
          >
            <Trash2Icon className="size-4" />
            Delete ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
      <div className="overflow-hidden w-full rounded-md border">
        <Table className="w-full table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as { className?: string } | undefined
                  return (
                    <TableHead key={header.id} className={cn(meta?.className)}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta as { className?: string } | undefined
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(meta?.className, disabled && "opacity-50 cursor-not-allowed")}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-4 lg:space-x-6">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              disabled={disabled}
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger size="sm" className="w-[72px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 15, 20, 25].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="outline"
              className="hidden size-8 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || disabled}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeftIcon />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || disabled}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="size-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || disabled}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRightIcon />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="hidden size-8 lg:flex"
              disabled={!table.getCanNextPage() || disabled}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
