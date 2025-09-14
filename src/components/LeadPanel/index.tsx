import { X, AtSign } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import { StatusSelect } from "../StatusSelect";

import type { LeadPanelProps } from "./types";
import { ActionButton } from "../ActionButton";

export function LeadPanel(props: LeadPanelProps) {
  const {
    selectedLead,
    setSelectedLead,
    setShowLeadPanel,
    showLeadPanel,
    uniqueStatusList,
    selectedStatus,
  } = props;

  const closeSidePanel = () => {
    setShowLeadPanel(false);
    setSelectedLead(null);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 ${
          showLeadPanel ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={closeSidePanel}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-xl bg-white shadow-xl z-50 transition-all duration-500 ease-out`}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Lead Details
              </h2>
              <p className="text-sm text-gray-500">
                {selectedLead.name} • {selectedLead.company}
              </p>
            </div>
            <button
              onClick={closeSidePanel}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          <div
            className="slide-over-panel is-open relative w-full max-w-2xl h-full bg-white shadow-xl flex flex-col"
            id="slide-over"
          >
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-medium text-[var(--text-secondary)]"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <p
                      className="mt-1 text-lg font-semibold text-[var(--text-primary)]"
                      id="name"
                    >
                      {selectedLead.name}
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-[var(--text-secondary)]"
                      htmlFor="company"
                    >
                      Company
                    </label>
                    <p
                      className="mt-1 text-lg font-semibold text-[var(--text-primary)]"
                      id="company"
                    >
                      {selectedLead.company}
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-[var(--text-secondary)]"
                      htmlFor="score"
                    >
                      Score
                    </label>
                    <p
                      className="mt-1 text-lg font-semibold text-[var(--text-primary)]"
                      id="score"
                    >
                      {selectedLead.score}
                    </p>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium text-[var(--text-secondary)]"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusSelect
                        statusList={uniqueStatusList}
                        handleStatusChange={(
                          event: React.ChangeEvent<HTMLSelectElement>
                        ) => {}}
                        selectedStatus={selectedStatus}
                      />

                      <StatusBadge status={selectedLead.status} />
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-[var(--text-secondary)]"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-400">
                        <AtSign size={16} />
                      </span>
                    </div>
                    <input
                      className="form-input block w-full pl-10"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      type="email"
                      value={selectedLead.email}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 bg-gray-50 border-t border-[var(--border-color)]">
              <div className="flex justify-end items-center space-x-3">
                <span
                  className="text-sm text-red-600"
                  id="error-message"
                ></span>
                <button
                  className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-white border border-[var(--border-color)] rounded-md shadow-sm hover:bg-gray-50 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition"
                  type="button"
                  onClick={() => setShowLeadPanel(false)}
                >
                  Cancel
                </button>
                <ActionButton>Save Changes</ActionButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
