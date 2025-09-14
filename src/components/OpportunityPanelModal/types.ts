import type { OpportunityProps, LeadProps } from "../../types";

export interface OpportunityPanelModalProps {
  opportunities: OpportunityProps[];
  selectedLead: LeadProps | null;
  setSelectedLead: React.Dispatch<React.SetStateAction<LeadProps | null>>;
  setShowOpportunityPanel: React.Dispatch<React.SetStateAction<boolean>>;
  setOpportunities: React.Dispatch<React.SetStateAction<OpportunityProps[]>>;
}
