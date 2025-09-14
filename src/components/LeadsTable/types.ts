import type { LeadProps } from "../../types";

export interface LeadsTableProps {
  filteredLeads: LeadProps[];
  handleConvertLead: (
    event: React.MouseEvent<HTMLButtonElement>,
    lead: LeadProps
  ) => void;
  handleShowLeadPanel: (lead: LeadProps) => void;
}
