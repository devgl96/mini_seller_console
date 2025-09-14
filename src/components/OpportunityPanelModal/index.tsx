import { useState } from "react";
import { Modal } from "../Modal";
import { ActionButton } from "../ActionButton";
import type { OpportunityProps } from "../../types";
import type { OpportunityPanelModalProps } from "./types";

export function OpportunityPanelModal(props: OpportunityPanelModalProps) {
  const {
    opportunities,
    selectedLead,
    setSelectedLead,
    setShowOpportunityPanel,
    setOpportunities,
  } = props;

  const [opportunityData, setOpportunityData] = useState<
    OpportunityProps | object
  >({
    id: selectedLead ? selectedLead.id : opportunities.length + 1,
    name: selectedLead ? selectedLead.name : "",
    stage: "",
    amount: 0,
    accountName: "",
  });

  function renderOpportunities() {
    return opportunities.map((opportunity) => (
      <tr
        key={opportunity.id}
        className="border-b border-gray-200 hover:bg-gray-100"
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
          {opportunity.id}
        </td>
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

    if (opportunityData) {
      setOpportunities((prev) => [...prev, opportunityData]);
      setOpportunityData({});
    }
  }

  return (
    <Modal
      isOpen
      onClose={() => {
        setShowOpportunityPanel(false);
        setSelectedLead(null);
      }}
      title="Create Opportunity"
    >
      <div className="flex flex-col h-[80vh] w-full">
        <form
          className="flex flex-col w-full"
          onSubmit={handleCreateOpportunity}
        >
          <div className="flex flex-wrap gap-3 items-center justify-center w-full">
            <div className="flex flex-col flex-1">
              <label className="block my-2 text-sm font-medium text-gray-900 ">
                Id
              </label>
              <input
                type="text"
                id="id"
                className="flex  border border-gray-500 rounded p-2 mt-2"
                value={opportunityData?.id || ""}
                onChange={(event) => {
                  setOpportunityData({
                    ...opportunityData,
                    id: Number(event.target.value),
                  });
                }}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="block my-2 text-sm font-medium text-gray-900 ">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="flex-1 border border-gray-500 rounded p-2 mt-2"
                value={opportunityData?.name || ""}
                onChange={(event) => {
                  setOpportunityData({
                    ...opportunityData,
                    name: event.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 items-center justify-center">
            <div className="flex flex-col flex-1">
              <label className="block my-2 text-sm font-medium text-gray-900 ">
                Stage
              </label>
              <input
                type="text"
                id="stage"
                className="flex-1 border border-gray-500 rounded p-2 mt-2"
                value={opportunityData?.stage || ""}
                onChange={(event) => {
                  setOpportunityData({
                    ...opportunityData,
                    stage: event.target.value,
                  });
                }}
              />
            </div>
            <div className="flex flex-col flex-1">
              <label className="block my-2 text-sm font-medium text-gray-900 ">
                Amount (Optional)
              </label>
              <input
                type="text"
                id="amount"
                className="flex-1 border border-gray-500 rounded p-2 mt-2"
                placeholder="100"
                value={opportunityData?.amount || ""}
                onChange={(event) => {
                  setOpportunityData({
                    ...opportunityData,
                    amount: Number(event.target.value),
                  });
                }}
              />
            </div>
          </div>
          <label className="block my-2 text-sm font-medium text-gray-900 ">
            Account Name
          </label>
          <input
            type="text"
            id="accountName"
            className="flex-1 border border-gray-500 rounded p-2 mt-2"
            placeholder="Account Name"
            value={opportunityData?.accountName || ""}
            onChange={(event) => {
              setOpportunityData({
                ...opportunityData,
                accountName: event.target.value,
              });
            }}
          />

          <ActionButton>Create Opportunity</ActionButton>
        </form>

        {opportunities.length > 0 ? (
          <>
            <div className="px-2 py-4 border-b border-gray-200 flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Opportunities
                </h2>
              </div>
            </div>

            <div className="flex flex-1 w-full h-[10vh] overflow-y-scroll rounded-lg border border-[var(--border-color)]">
              <table className="w-full divide-y divide-gray-200 ">
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
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Amount
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Account Name
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {renderOpportunities()}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h1 className="flex font-bold bg-gray-200 rounded  items-center justify-center w-full h-full">
            No Opportunities
          </h1>
        )}
      </div>
    </Modal>
  );
}
