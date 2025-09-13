import type { LeadProps } from "../../App";

interface Opportunity {
  id: number;
  name: string;
  stage: string;
  amount: number;
  accountName: string;
}

interface OpportunityPanelModalProps {
  opportunities: Opportunity[];
  selectedLead: LeadProps | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<LeadProps | null>>;
  setShowOpportunityPanel: React.Dispatch<React.SetStateAction<boolean>>;
}

export function OpportunityPanelModal(props: OpportunityPanelModalProps) {
  const {
    opportunities,
    selectedLead,
    setSelectedLead,
    setShowOpportunityPanel,
  } = props;

  function renderOpportunities() {
    return opportunities.map((opportunity) => (
      <tr
        key={opportunity.id}
        className="border-b border-gray-200 hover:bg-gray-100"
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {opportunity.name}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {opportunity.stage}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {opportunity.amount}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {opportunity.accountName}
        </td>
      </tr>
    ));
  }

  function handleCreateOpportunity(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    // Idea:
    // Form for opportunity with these properties
    // id, name, stage, amount(optional), accountName
    // and a button to create the opportunity
    // and a button to close the panel
    // Below of that show a simple table shows the opportunities
    <>
      <div
        className="fixed top-0 left-0 h-full w-xl bg-white shadow-xl z-50 transition-all duration-500 ease-out"
        onClick={() => setShowOpportunityPanel(false)}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-8xl">
              <h1 className="text-center font-black text-2xl">
                Create Opportunity
              </h1>
            </div>
          </div>

          <form
            className="flex-1 overflow-y-auto p-8"
            onSubmit={handleCreateOpportunity}
          >
            <div className="mx-auto max-w-8xl">
              <h1 className="text-center font-black text-2xl">
                Create Opportunity
              </h1>
            </div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Id
            </label>
            <input
              type="text"
              id="id"
              className="form-input"
              value={selectedLead?.id || ""}
              onChange={(event) => {}}
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="form-input"
              value={selectedLead?.name || ""}
              onChange={(event) => {}}
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Stage
            </label>
            <input
              type="text"
              id="stage"
              className="form-input"
              value={selectedLead?.stage || ""}
              onChange={(event) => {}}
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Amount
            </label>
            <input
              type="text"
              id="amount"
              className="form-input"
              value={selectedLead?.amount || ""}
              onChange={(event) => {}}
            />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Account Name
            </label>
            <input
              type="text"
              id="accountName"
              className="form-input"
              value={selectedLead?.accountName || ""}
              onChange={(event) => {}}
            />
            <button
              className="flex items-center justify-center gap-1 border border-gray-500 rounded p-2 mt-2 hover:cursor-pointer"
              type="submit"
            >
              Create Opportunity
            </button>
          </form>
          <div className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-8xl">
              <h1 className="text-center font-black text-2xl">Opportunities</h1>
            </div>
            <table className="w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Id
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Name
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Stage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {renderOpportunities()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
