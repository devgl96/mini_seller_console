import { useEffect, useState } from "react";

import LeadList from "./assets/leads_list.json";

import "./App.css";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Funnel,
  X,
} from "lucide-react";
import { Modal } from "./components/Modal";
import { cn, getDataStorage, saveDataStorage } from "./utils";

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
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [uniqueStatusList, setUniqueStatusList] = useState<
    StatusListProps[] | []
  >([]);
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
    loadOptionsStatus();
  }, [staticLeads.length]);

  useEffect(() => {
    updateLeads();
  }, [uniqueStatusList, typeSortScore]);

  function handleOpenModal() {
    setShowStatusModal(true);
  }

  function handleCloseModal() {
    setShowStatusModal(false);
  }

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
    const filteredLeads = list.filter((lead) =>
      uniqueStatusList.some(
        (status) => status.status === lead.status && status.checked
      )
    );

    return filteredLeads;
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;

    const updatedStatusList = uniqueStatusList.map((lead) => {
      if (lead.status === name) {
        return { ...lead, checked };
      }
      return lead;
    });

    if (updatedStatusList.length) {
      saveDataStorage("msc-statusList", updatedStatusList);
    }

    setUniqueStatusList(updatedStatusList);
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
    if (typeSortScore === "desc") {
      return (
        <ArrowDownWideNarrow
          size={16}
          className="cursor-pointer hover:text-gray-400"
          onClick={handleSortScore}
        />
      );
    }

    return (
      <ArrowUpWideNarrow
        size={16}
        className="cursor-pointer hover:text-gray-400"
        onClick={handleSortScore}
      />
    );
  }

  function renderLeadPanel() {
    if (!showLeadPanel || !selectedLead) return <></>;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-10 flex justify-end z-40">
        <div
          className="slide-over-panel is-open relative w-full max-w-2xl h-full bg-white shadow-xl flex flex-col"
          id="slide-over"
        >
          <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Lead Details
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {selectedLead.name} • {selectedLead.company}
              </p>
            </div>
            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              <span
                className="material-symbols-outlined"
                onClick={() => setShowLeadPanel(false)}
              >
                <X
                  size={16}
                  className="hover:text-gray-400 hover:cursor-pointer"
                />
              </span>
            </button>
          </div>
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
                    <select
                      className="form-select w-full"
                      id="status"
                      name="status"
                    >
                      <option selected={undefined} value="New">
                        New
                      </option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Unqualified">Unqualified</option>
                    </select>
                    <span
                      className={cn(
                        "status-badge",
                        `status-${selectedLead.status.toLowerCase()}`
                      )}
                    >
                      {selectedLead.status}
                    </span>
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
                      mail
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
              <span className="text-sm text-red-600" id="error-message"></span>
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
    );
  }

  function handleShowLeadPanel(lead: LeadsProps) {
    setSelectedLead(lead);
    setShowLeadPanel(true);
  }

  function renderLeads() {
    const filteredLeads = searchLeadsByNameOrCompany(searchLeads);

    return (
      <div className="relative h-screen w-full">
        <div className="flex gap-1 justify-between items-center p-1 border-b border-gray-600 ">
          <span>ID</span>
          <span>Name</span>
          <span>Company</span>
          <span>Email</span>
          <span>Source</span>
          <span className="flex gap-1 items-center relative">
            Score {renderSortScoreIcon()}{" "}
            <b className="uppercase">{typeSortScore}</b>
          </span>
          <span className="flex gap-1 items-center relative">
            Status{" "}
            <Funnel
              size={16}
              onClick={handleOpenModal}
              className="cursor-pointer hover:text-gray-400"
            />
            <Modal isOpen={showStatusModal} onClose={() => handleCloseModal()}>
              {uniqueStatusList.map((lead) => (
                <div
                  className="flex gap-2 justify-start items-center min-w-fit max-w-full w-32"
                  key={lead.status}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 hover:text-gray-600 hover:cursor-pointer"
                    name={lead.status}
                    id={lead.status}
                    checked={lead.checked}
                    onChange={(event) => handleStatusChange(event)}
                  />
                  <span>{lead.status}</span>
                </div>
              ))}
            </Modal>
          </span>
        </div>

        <div className="overflow-y-scroll h-screen">
          {filteredLeads.map((lead) => (
            <div
              className="flex gap-1 justify-between items-center p-1 border-b border-gray-600 hover:bg-gray-300 hover:cursor-pointer"
              key={lead.id}
              onClick={() => handleShowLeadPanel(lead)}
            >
              <span>{lead.id}</span>
              <span>{lead.name}</span>
              <span>{lead.company}</span>
              <span>{lead.email}</span>
              <span>{lead.source}</span>
              <span>{lead.score}</span>
              <span>{lead.status}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function loadOptionsStatus() {
    const statusListDataStorage = getDataStorage("msc-statusList");

    if (statusListDataStorage) {
      setUniqueStatusList(statusListDataStorage);
      return;
    }

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
    <div className="relative w-full p-10 h-screen flex flex-col items-center">
      <h1 className="font-black text-2xl">Mini Seller Console</h1>

      <input
        className="w-full border border-gray-500 rounded p-2 mt-2"
        type="text"
        placeholder="Search leads (name/company)"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setSearchLeads(event.target.value)
        }
      />

      {renderLeads()}

      {renderLeadPanel()}
    </div>
  );
}

export default App;
