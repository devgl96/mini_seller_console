import { useRef, useState } from "react";

import LeadList from "./assets/leads_list.json";

import "./App.css";

function App() {
  const staticLeads = useRef(LeadList);
  const [leads, setLeads] = useState(LeadList);

  function renderLeads() {
    return leads.map((lead) => {
      return (
        <div
          className="flex gap-1 justify-between items-center p-1 border-b border-gray-600 hover:bg-gray-700"
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
      );
    });
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
    <div className="w-full p-10 h-screen flex flex-col items-center">
      <h1 className="font-black text-2xl">Mini Seller Console</h1>

      <input
        className="w-full border border-gray-500 rounded p-2 mt-2"
        type="text"
        placeholder="Search leads (name/company)"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          searchLeadsByNameOrCompany(event)
        }
      />

      <div className="h-full w-full overflow-y-scroll">{renderLeads()}</div>
    </div>
  );
}

export default App;
