import { useState } from "react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    pageSize?: number;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Search...",
    pageSize = 10,
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState("");

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = filterValue.toLowerCase();
            return columns.some(col => {
                const key = (col as any).accessorKey;
                if (!key) return false;
                const value = row.getValue(key);
                return String(value ?? "").toLowerCase().includes(search);
            });
        },
        initialState: {
            pagination: { pageSize },
        },
    });

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const totalResults = table.getFilteredRowModel().rows.length;
    const startRow = (currentPage - 1) * table.getState().pagination.pageSize + 1;
    const endRow = Math.min(currentPage * table.getState().pagination.pageSize, totalResults);

    return (
        <div className="flex flex-col gap-3">
            {/* ── Toolbar ── */}
            <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="relative">
                    <svg
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <Input
                        placeholder={searchPlaceholder}
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="pl-8 h-8 w-64 text-sm"
                    />
                </div>
                <span className="text-xs text-muted-foreground">
                    {totalResults} record{totalResults !== 1 ? "s" : ""}
                </span>
            </div>

            {/* ── Table ── */}
            <div className="rounded-lg border overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(hg => (
                            <TableRow key={hg.id} className="bg-muted/50 hover:bg-muted/50">
                                {hg.headers.map(header => (
                                    <TableHead
                                        key={header.id}
                                        className="h-9 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row, i) => (
                                <TableRow
                                    key={row.id}
                                    className={`h-9 hover:bg-accent/50 transition-colors border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"
                                        }`}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id} className="px-3 py-0 text-sm">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-sm text-muted-foreground"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* ── Pagination ── */}
            {totalResults > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                        Showing {startRow}–{endRow} of {totalResults} results
                    </p>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-xs"
                            onClick={() => table.firstPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            «
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            ← Prev
                        </Button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                            .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                acc.push(p);
                                return acc;
                            }, [])
                            .map((item, idx) =>
                                item === "..." ? (
                                    <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">…</span>
                                ) : (
                                    <Button
                                        key={item}
                                        variant={currentPage === item ? "default" : "outline"}
                                        size="sm"
                                        className="h-7 w-7 p-0 text-xs"
                                        onClick={() => table.setPageIndex((item as number) - 1)}
                                    >
                                        {item}
                                    </Button>
                                )
                            )}

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next →
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-xs"
                            onClick={() => table.lastPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            »
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
