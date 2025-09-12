import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';

import { ComparisonResponse, ProviderRow } from 'types/wise.types';
import { flattenToRows, isoDurationToHuman, timeAgo } from 'utils/helper.function';

import Badge from './Badge';
import TypePill from './TypePill';
import SortIcon from './SortIcon';
import TopThree from './TopThree';
import CheckIcon from './CheckIcon';

const WiseComparisonTable = ({ data }: { data: ComparisonResponse }) => {
  const rows = React.useMemo(() => flattenToRows(data), [data]);
  const bestReceived = React.useMemo(
    () => Math.max(...rows.map((r) => r.bestQuote?.receivedAmount ?? 0)),
    [rows],
  );

  const [globalFilter, setGlobalFilter] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [midOnly, setMidOnly] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([{ id: 'received', desc: true }]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  // Build table data after applying simple external filters
  const filteredRows = React.useMemo(() => {
    return rows.filter((r) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (midOnly && !r.isMidMarket) return false;
      if (
        globalFilter &&
        !`${r.name} ${r.alias}`.toLowerCase().includes(globalFilter.toLowerCase())
      )
        return false;
      return true;
    });
  }, [rows, typeFilter, midOnly, globalFilter]);

  type TableRow = ProviderRow & { received: number; fee: number; rate: number; markup: number };

  const tableData: TableRow[] = React.useMemo(
    () =>
      filteredRows.map((r) => ({
        ...r,
        received: r.bestQuote?.receivedAmount ?? 0,
        fee: r.bestQuote?.fee ?? 0,
        rate: r.bestQuote?.rate ?? 0,
        markup: r.bestQuote?.markup ?? 0,
      })),
    [filteredRows],
  );

  const columns = React.useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        id: 'provider',
        header: () => <span className="whitespace-nowrap">Provider</span>,
        cell: ({ row }) => {
          const r = row.original;
          const isBest = r.bestQuote?.receivedAmount === bestReceived;
          return (
            <div className="flex items-center gap-3 min-w-[16rem]">
              {r.logoSrc ? (
                // Use next/image in Next.js app for optimization
                <img
                  src={r.logoSrc}
                  alt={r.name}
                  className="h-6 w-auto object-contain"
                  loading="lazy"
                />
              ) : (
                <div className="h-6 w-6 rounded bg-gray-100" />
              )}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{r.name}</span>
                  {isBest && (
                    <Badge className="bg-green-100 text-green-800 border border-green-200">
                      Best
                    </Badge>
                  )}
                  {r.partner && (
                    <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-200">
                      Partner
                    </Badge>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                  <TypePill type={r.type} />
                  {r.alias && <span className="hidden sm:inline">• {r.alias}</span>}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'received',
        header: ({ column }) => (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Received ({data.targetCurrency})
            <SortIcon dir={column.getIsSorted() as any} />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="font-semibold">
            {Number(getValue<number>()).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        accessorKey: 'rate',
        header: ({ column }) => (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Rate
            <SortIcon dir={column.getIsSorted() as any} />
          </button>
        ),
        cell: ({ getValue }) => <span>{Number(getValue<number>()).toFixed(6)}</span>,
      },
      {
        accessorKey: 'fee',
        header: ({ column }) => (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Fee ({data.sourceCurrency})
            <SortIcon dir={column.getIsSorted() as any} />
          </button>
        ),
        cell: ({ getValue }) => (
          <span>
            {Number(getValue<number>()).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        ),
      },
      {
        id: 'effective',
        header: ({ column }) => (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Effective Rate
            <SortIcon dir={column.getIsSorted() as any} />
          </button>
        ),
        sortingFn: (a, b) => {
          // received / send-amount — we only have the original source amount from the response
          const amount = data.amount || 1;
          const ea = (a.original.bestQuote?.receivedAmount ?? 0) / amount;
          const eb = (b.original.bestQuote?.receivedAmount ?? 0) / amount;
          return ea === eb ? 0 : ea > eb ? 1 : -1;
        },
        cell: ({ row }) => {
          const amount = data.amount || 1;
          const eff = (row.original.bestQuote?.receivedAmount ?? 0) / amount;
          return <span>{eff.toFixed(6)}</span>;
        },
      },
      {
        accessorKey: 'markup',
        header: ({ column }) => (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Markup %
            <SortIcon dir={column.getIsSorted() as any} />
          </button>
        ),
        cell: ({ getValue }) => <span>{Number(getValue<number>()).toFixed(4)}%</span>,
      },
      {
        id: 'mid',
        header: () => <span>Mid‑Market</span>,
        cell: ({ row }) =>
          row.original.isMidMarket ? (
            <span className="inline-flex items-center gap-1 text-green-700">
              <CheckIcon /> <span className="text-sm">Yes</span>
            </span>
          ) : (
            <span className="text-sm text-gray-500">No</span>
          ),
        enableSorting: false,
      },
      {
        id: 'eta',
        header: () => <span>ETA</span>,
        cell: ({ row }) => {
          const d = row.original.bestQuote?.deliveryEstimation?.duration;
          const text = isoDurationToHuman(d) || '—';
          return <span className="text-sm text-gray-700">{text}</span>;
        },
        enableSorting: false,
      },
      {
        id: 'collected',
        header: ({ column }) => (
          <button
            className="flex items-center"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Collected
            <SortIcon dir={column.getIsSorted() as any} />
          </button>
        ),
        sortingFn: (a, b) => {
          const ta = new Date(a.original.bestQuote?.dateCollected || 0).getTime();
          const tb = new Date(b.original.bestQuote?.dateCollected || 0).getTime();
          return ta === tb ? 0 : ta > tb ? 1 : -1;
        },
        cell: ({ row }) => (
          <span className="text-sm text-gray-600">
            {timeAgo(row.original.bestQuote?.dateCollected)}
          </span>
        ),
      },
    ],
    [bestReceived, data.amount, data.sourceCurrency, data.targetCurrency],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, columnVisibility, columnFilters },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search provider…"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-60 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="all">All types</option>
            <option value="moneyTransferProvider">Money Transfer Provider</option>
            <option value="bank">Bank</option>
          </select>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={midOnly}
              onChange={(e) => setMidOnly(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Mid‑market only
          </label>
        </div>

        {/* Column toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {table.getAllLeafColumns().map((col) => (
            <label key={col.id} className="inline-flex items-center gap-1 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={col.getIsVisible()}
                onChange={col.getToggleVisibilityHandler()}
                className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              {col.id}
            </label>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-50">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-gray-200">
                {hg.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-semibold text-gray-700">
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top 3 summary */}
      <TopThree rows={tableData} currency={data.targetCurrency} />
    </div>
  );
};

export default WiseComparisonTable;
