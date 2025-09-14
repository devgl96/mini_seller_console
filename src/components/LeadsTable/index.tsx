import { TrendingUp } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import { ActionButton } from "../ActionButton";
import type { LeadsTableProps } from "./types";

export function LeadsTable(props: LeadsTableProps) {
  const { filteredLeads, handleConvertLead, handleShowLeadPanel } = props;

  return (
    <div className="flex-1 w-full md:h-[75vh] h-[65vh] overflow-y-scroll rounded-lg border border-[var(--border-color)]">
      {filteredLeads.length > 0 ? (
        <table className="w-full divide-y divide-[var(--border-color)]">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] hidden md:table-cell"
                scope="col"
              >
                Id
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                scope="col"
              >
                Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                scope="col"
              >
                Company
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] hidden lg:table-cell"
                scope="col"
              >
                Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)] hidden lg:table-cell"
                scope="col"
              >
                Source
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                scope="col"
              >
                Score
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                scope="col"
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                scope="col"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => handleShowLeadPanel(lead)}
                className="hover:bg-gray-100 hover:cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">{lead.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-900">{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-900">{lead.source}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <StatusBadge status={lead.status} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <ActionButton
                      onClick={(event) => handleConvertLead(event, lead)}
                      className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-3 py-1.5 text-xs text-white shadow-sm hover:shadow-md hover:cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">
                        <TrendingUp size={16} />
                      </span>
                      Convert Lead
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h1 className="flex font-bold bg-gray-200 rounded  items-center justify-center w-full h-full">
          No leads found
        </h1>
      )}
    </div>
  );
}
