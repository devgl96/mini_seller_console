import { useEffect, useState } from "react";

import LeadList from "./assets/leads_list.json";

import "./App.css";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Funnel } from "lucide-react";
import { Modal } from "./components/Modal";
import { getDataStorage, saveDataStorage } from "./utils";

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
              className="flex gap-1 justify-between items-center p-1 border-b border-gray-600 hover:bg-gray-300"
              key={lead.id}
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
    </div>
  );
}

export default App;
