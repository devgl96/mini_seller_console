import { useEffect, useRef, useState } from "react";

import LeadList from "./assets/leads_list.json";

import "./App.css";
import { Funnel } from "lucide-react";
import { Modal } from "./components/Modal";

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

function App() {
  const staticLeads = useRef<LeadsProps[]>(LeadList);
  const [leads, setLeads] = useState<LeadsProps[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [uniqueStatusList, setUniqueStatusList] = useState<
    StatusListProps[] | []
  >([]);

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    renderOptionsStatus();
  }, [staticLeads]);

  useEffect(() => {
    filterLeadsByStatus();
  }, [uniqueStatusList]);

  function handleOpenModal() {
    setShowStatusModal(true);
  }

  function handleCloseModal() {
    setShowStatusModal(false);
  }

  function loadLeads() {
    setLeads(staticLeads.current);
  }

  function filterLeadsByStatus() {
    const filteredLeads = staticLeads.current.filter((lead) => {
      return uniqueStatusList.some(
        (status) => status.status === lead.status && status.checked
      );
    });
    setLeads(filteredLeads);
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;

    const updatedStatusList = uniqueStatusList.map((lead) => {
      if (lead.status === name) {
        return { ...lead, checked };
      }
      return lead;
    });

    setUniqueStatusList(updatedStatusList);
  }

  function renderLeads() {
    return (
      <div className="relative h-screen w-full">
        <div className="flex gap-1 justify-between items-center p-1 border-b border-gray-600 ">
          <span>ID</span>
          <span>Name</span>
          <span>Company</span>
          <span>Email</span>
          <span>Source</span>
          <span>Score</span>
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
          {leads.map((lead) => (
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

  function renderOptionsStatus() {
    const statusList = staticLeads.current.map((lead) => lead.status);
    const uniqueOptionsStatusList = Array.from(new Set(statusList));

    const optionsStatusList = uniqueOptionsStatusList.map((status) => {
      return {
        status,
        checked: true,
      };
    });

    setUniqueStatusList(optionsStatusList);
  }

  function searchLeadsByNameOrCompany(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const query = event.target?.value ?? "";

    const filteredLeads = staticLeads.current.filter((lead) => {
      return (
        lead.name.toLowerCase().includes(query.toLowerCase()) ||
        lead.company.toLowerCase().includes(query.toLowerCase())
      );
    });

    setLeads(() => {
      return filteredLeads;
    });
  }

  return (
    <div className="relative w-full p-10 h-screen flex flex-col items-center">
      <h1 className="font-black text-2xl">Mini Seller Console</h1>

      <input
        className="w-full border border-gray-500 rounded p-2 mt-2"
        type="text"
        placeholder="Search leads (name/company)"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          searchLeadsByNameOrCompany(event)
        }
      />

      {renderLeads()}
    </div>
  );
}

export default App;
