import { useEffect, useState } from "react";

import LeadList from "./assets/leads_list.json";

import "./App.css";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  AtSign,
  TrendingUp,
  X,
} from "lucide-react";
import { getDataStorage, saveDataStorage } from "./utils";
import { StatusBadge } from "./components/StatusBadge";
import { StatusSelect } from "./components/StatusSelect";

interface StatusListProps {
  status: string;
  checked: boolean;
}

interface LeadsProps {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: string;
}
type TypeSortScoreProps = "asc" | "desc" | null;

function App() {
  const [staticLeads, setStaticLeads] = useState<LeadsProps[]>([]);
  const [leads, setLeads] = useState<LeadsProps[]>([]);
  const [searchLeads, setSearchLeads] = useState("");
  const [uniqueStatusList, setUniqueStatusList] = useState<
    StatusListProps[] | []
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [typeSortScore, setTypeSortScore] = useState<TypeSortScoreProps>(null);
  const [showLeadPanel, setShowLeadPanel] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadsProps | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    loadTypeSortScore();
  }, []);

  useEffect(() => {
    loadSelectedStatus();
  }, []);

  useEffect(() => {
    loadOptionsStatus();
  }, [staticLeads.length]);

  useEffect(() => {
    updateLeads();
  }, [selectedStatus, typeSortScore]);

  function getLeads(): Promise<LeadsProps[]> {
    return new Promise((resolve, reject) => {
      if (resolve) {
        return resolve(LeadList);
      }

      return reject([]);
    });
  }

  function loadTypeSortScore() {
    const typeCurrentSortScore = getDataStorage("msc-typeSortScore");
    if (typeCurrentSortScore) {
      setTypeSortScore(typeCurrentSortScore);
    }
  }

  async function loadLeads() {
    const getStaticLeads = await getLeads();

    setStaticLeads(getStaticLeads);

    updateLeads(getStaticLeads);
  }

  function updateLeads(list: LeadsProps[] = staticLeads) {
    const filterLeads = filterLeadsByStatus(list);
    const sortedLeads = sortLeadsByScoreType(filterLeads);

    setLeads(sortedLeads);
  }

  function filterLeadsByStatus(list: LeadsProps[]) {
    console.log("🧐 >>> filterLeadsByStatus >>> list:", list);

    if (!selectedStatus) return list;

    const filteredLeads = list.filter((lead) => selectedStatus === lead.status);

    console.log("🧐 >>> filterLeadsByStatus >>> filteredLeads:", filteredLeads);

    return filteredLeads;
  }

  function handleStatusChange(
    statusSelected: React.ChangeEvent<HTMLSelectElement>
  ) {
    if (statusSelected.target.value) setSelectedStatus(null);

    const status = statusSelected.target.value;

    saveDataStorage("msc-selectedStatus", status);

    setSelectedStatus(status);
  }

  function handleSortScore() {
    const typeCurrentSortScore = !typeSortScore
      ? "desc"
      : typeSortScore === "desc"
      ? "asc"
      : "desc";

    saveDataStorage("msc-typeSortScore", typeCurrentSortScore);
    setTypeSortScore(typeCurrentSortScore);

    const sortedLeads = sortLeadsByScoreType(staticLeads);
    setLeads(sortedLeads);
  }

  function sortLeadsByScoreType(list: LeadsProps[]): LeadsProps[] {
    if (!typeSortScore) return list;

    const sortedLeads = [...list].sort((a, b) =>
      typeSortScore === "asc" ? a.score - b.score : b.score - a.score
    );

    return sortedLeads;
  }

  function renderSortScoreIcon() {
    return typeSortScore === "desc" ? (
      <ArrowDownWideNarrow size={16} />
    ) : (
      <ArrowUpWideNarrow size={16} />
    );
  }

  function renderLeadPanel() {
    if (!showLeadPanel || !selectedLead) return <></>;

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
                  <button
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-[var(--text-on-primary)] bg-[var(--primary-color)] border border-transparent rounded-md shadow-sm hover:bg-[var(--primary-color-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary-color)] transition"
                    type="submit"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function handleShowLeadPanel(lead: LeadsProps) {
    setSelectedLead(lead);
    setShowLeadPanel(true);
  }

  function renderLeads() {
    const filteredLeads = searchLeadsByNameOrCompany(searchLeads);

    return (
      <div className="flex-1 w-full h-[75vh] overflow-y-scroll rounded-lg border border-[var(--border-color)]">
        <table className="w-full divide-y divide-[var(--border-color)]">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
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
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
                scope="col"
              >
                Email
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--text-secondary)]"
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
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
                    <button className="flex items-center gap-2 rounded-md bg-[var(--primary-color)] px-3 py-1.5 text-xs text-white shadow-sm hover:bg-opacity-90">
                      <span className="material-symbols-outlined text-base">
                        <TrendingUp size={16} />
                      </span>
                      Convert Lead
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  function loadSelectedStatus() {
    const statusDataStorage = getDataStorage("msc-selectedStatus");

    setSelectedStatus(statusDataStorage || null);
  }

  function loadOptionsStatus() {
    const statusList = staticLeads.map((lead) => lead.status);
    const uniqueOptionsStatusList = Array.from(new Set(statusList));

    const optionsStatusList = uniqueOptionsStatusList.map((status) => {
      return {
        status,
        checked: true,
      };
    });

    setUniqueStatusList(optionsStatusList);
  }

  function searchLeadsByNameOrCompany(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    const lowerCaseData = (leadContent: string) => leadContent.toLowerCase();

    const filteredLeads = [...leads].filter(
      (lead) =>
        lowerCaseData(lead.name).includes(lowerCaseQuery) ||
        lowerCaseData(lead.company).includes(lowerCaseQuery)
    );

    return filteredLeads;
  }

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="mx-auto max-w-8xl">
        <h1 className="text-center font-black text-2xl">Mini Seller Console</h1>

        <div className="flex flex-1 gap-4 my-4">
          <input
            className="flex-1 border border-gray-500 rounded p-2 mt-2"
            type="text"
            placeholder="Search leads (name/company)"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchLeads(event.target.value)
            }
          />
          <StatusSelect
            statusList={uniqueStatusList}
            handleStatusChange={handleStatusChange}
            selectedStatus={selectedStatus}
          />
          <button
            className="flex items-center justify-center gap-1 border border-gray-500 rounded p-2 mt-2 hover:cursor-pointer"
            onClick={handleSortScore}
          >
            Score {renderSortScoreIcon()}
            <b className="uppercase">{typeSortScore}</b>
          </button>
        </div>

        {renderLeads()}

        {renderLeadPanel()}
      </div>
    </main>
  );
}

export default App;
