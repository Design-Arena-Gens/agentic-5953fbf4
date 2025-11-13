'use client';

import { ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  format?: (value: T[keyof T], row: T) => ReactNode;
  align?: "left" | "center" | "right";
};

type LogTableProps<T> = {
  title: string;
  description?: string;
  columns: Array<Column<T>>;
  rows: T[];
  empty: string;
};

export function LogTable<T>({
  title,
  description,
  columns,
  rows,
  empty,
}: LogTableProps<T>) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </header>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[520px] table-fixed border-separate border-spacing-y-2">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-400">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="rounded-lg bg-slate-50 px-4 py-3 font-semibold"
                  style={{ textAlign: column.align ?? "left" }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="rounded-xl bg-slate-50 px-6 py-6 text-center text-sm text-slate-500"
                >
                  {empty}
                </td>
              </tr>
            )}
            {rows.map((row, index) => (
              <tr
                key={index}
                className="rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-4 py-3 text-sm text-slate-600"
                    style={{ textAlign: column.align ?? "left" }}
                  >
                    {column.format
                      ? column.format(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
