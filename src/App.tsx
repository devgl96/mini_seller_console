import { useState } from "react";

import LeadList from "./assets/leads_list.json";

import "./App.css";

function App() {
  const [leads, setLeads] = useState(LeadList);

  function renderLeads() {
    return leads.map((lead) => {
      return (
        <div className="flex gap-1 justify-between items-center p-1 border-b border-gray-600 hover:bg-gray-700">
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

  return (
    <div className="w-full p-10 h-screen flex flex-col items-center">
      <h1 className="font-black text-2xl">Mini Seller Console</h1>

      <div className="h-full w-full overflow-y-scroll">{renderLeads()}</div>
    </div>
  );
}

export default App;
