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
import { OpportunityPanelModal } from "./components/OpportunityPanelModal";
import type {
  OpportunityProps,
  LeadProps,
  StatusListProps,
  TypeSortScoreProps,
} from "./types";
import { LeadPanel } from "./components/LeadPanel";
import { LeadsTable } from "./components/LeadsTable";

function App() {
  const [staticLeads, setStaticLeads] = useState<LeadProps[]>([]);
  const [leads, setLeads] = useState<LeadProps[]>([]);
  const [searchLeads, setSearchLeads] = useState("");
  const [uniqueStatusList, setUniqueStatusList] = useState<
    StatusListProps[] | []
  >([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [typeSortScore, setTypeSortScore] = useState<TypeSortScoreProps>(null);
  const [showLeadPanel, setShowLeadPanel] = useState(false);
  const [showOpportunityPanel, setShowOpportunityPanel] = useState(false);
  const [selectedLead, setSelectedLead] = useState<LeadProps | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityProps[]>([]);

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

  function getLeads(): Promise<LeadProps[]> {
    return new Promise((resolve, reject) => {
      if (resolve) {
        return resolve(LeadList);
      }

      return reject([]);
    });
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

  function handleShowLeadPanel(lead: LeadProps) {
    setSelectedLead(lead);
    setShowLeadPanel(true);
  }

  function handleConvertLead(
    event: React.MouseEvent<HTMLButtonElement>,
    lead: LeadProps
  ) {
    event.stopPropagation();
    setSelectedLead(lead);
    setShowOpportunityPanel(true);
  }

  function updateLeads(list: LeadProps[] = staticLeads) {
    const filterLeads = filterLeadsByStatus(list);
    const sortedLeads = sortLeadsByScoreType(filterLeads);

    setLeads(sortedLeads);
  }

  function filterLeadsByStatus(list: LeadProps[]) {
    if (!selectedStatus) return list;

    const filteredLeads = list.filter((lead) => selectedStatus === lead.status);

    return filteredLeads;
  }

  function sortLeadsByScoreType(list: LeadProps[]): LeadProps[] {
    if (!typeSortScore) return list;

    const sortedLeads = [...list].sort((a, b) =>
      typeSortScore === "asc" ? a.score - b.score : b.score - a.score
    );

    return sortedLeads;
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

  function renderLeads() {
    const filteredLeads = searchLeadsByNameOrCompany(searchLeads);

    return (
      <LeadsTable
        filteredLeads={filteredLeads}
        handleConvertLead={handleConvertLead}
        handleShowLeadPanel={handleShowLeadPanel}
      />
    );
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

    return (
      <LeadPanel
        selectedLead={selectedLead}
        setSelectedLead={setSelectedLead}
        setShowLeadPanel={setShowLeadPanel}
        showLeadPanel={showLeadPanel}
        uniqueStatusList={uniqueStatusList}
        selectedStatus={selectedStatus}
      />
    );
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

        {showOpportunityPanel && (
          <OpportunityPanelModal
            selectedLead={selectedLead}
            setShowOpportunityPanel={setShowOpportunityPanel}
            opportunities={opportunities}
            setSelectedLead={setSelectedLead}
            setOpportunities={setOpportunities}
          />
        )}
      </div>
    </main>
  );
}

export default App;
