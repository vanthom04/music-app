"use client"

import Link from "next/link"
import { ColumnDef } from "@tanstack/react-table"

import { formatTime } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { SongGetMany } from "@/modules/songs/types"

import { Actions } from "./actions"

export const columns: ColumnDef<SongGetMany[number]>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: "w-[40px] text-center"
    }
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link href={`/songs/${row.original.id}`}>
        <div className="truncate">
          {row.original.title}
        </div>
      </Link>
    ),
    meta: {
      className: "w-[40%]"
    }
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => (
      <div className="truncate">{row.original.artist}</div>
    )
  },
  {
    accessorKey: "album",
    header: "Album",
    cell: ({ row }) => (
      <div className="truncate">{row.original.album}</div>
    )
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <div className="truncate">{formatTime(row.original.duration)}</div>
    ),
    meta: {
      className: "w-[100px] text-center"
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />,
    meta: {
      className: "w-[50px]"
    }
  }
]
