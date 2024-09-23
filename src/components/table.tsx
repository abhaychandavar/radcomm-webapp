"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoaderIcon } from "lucide-react";

export function DataTable({
  columns,
  data,
  fetchData,
  searchBar,
  pagination = false,
  reset = false
}: {
  columns: ColumnDef<any>[];
  data?: any[];
  fetchData?: (page: number, perPage: number) => Promise<any[]>;
  searchBar?: { placeholder: string };
  pagination?: boolean;
  reset?: boolean;
}) {
  const [cachedData, setCachedData] = React.useState<Record<number, any[]>>({});
  const [currentData, setCurrentData] = React.useState<any[]>(data || []);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch data when fetchData function is provided, otherwise use provided data
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (fetchData) {
        if (cachedData[pageIndex]) {
          setCurrentData(cachedData[pageIndex]);
          setLoading(false);
        } else {
          try {
            const fetchedData = await fetchData(pageIndex, pageSize);
            setCachedData(prev => ({ ...prev, [pageIndex]: fetchedData }));
            setCurrentData(fetchedData);
          } catch (error) {
            console.error("Error fetching data:", error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setCurrentData(data || []);
        setLoading(false);
      }
    };

    loadData();
  }, [fetchData, pageSize, pageIndex, data]);

  React.useEffect(() => {
    if (reset) {
      setPageIndex(0);
      setSorting([]);
      setColumnFilters([]);
      setColumnVisibility({});
      setRowSelection({});
      if (fetchData) {
        setCurrentData(data || []);
        cachedData[pageIndex] = undefined;
      }
    }
  }, [reset]);
  
  const table = useReactTable({
    data: currentData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center py-10">
          <LoaderIcon className="w-4 h-4 animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            {searchBar && (
              <div className="flex items-center">
                <Input
                  placeholder={searchBar.placeholder}
                  value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("email")?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
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
          {pagination && (
            <Pagination className="mt-4 flex justify-start">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                    aria-disabled={pageIndex === 0}
                    className={pageIndex > 0 ? "cursor-pointer" : 'cursor-not-allowed'}
                  />
                </PaginationItem>
                {Array.from({ length: Math.ceil(currentData.length / pageSize) }, (_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      onClick={() => setPageIndex(index)}
                      isActive={index === pageIndex}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPageIndex((prev) => prev + 1)}
                    aria-disabled={!table.getCanNextPage()}
                    className={table.getCanNextPage() ? "cursor-pointer" : 'cursor-not-allowed'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}