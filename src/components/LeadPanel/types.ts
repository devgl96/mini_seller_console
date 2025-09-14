import type { LeadProps } from "../../types";

export interface LeadPanelProps {
  selectedLead: LeadProps;
  setSelectedLead: React.Dispatch<React.SetStateAction<LeadProps | null>>;
  setShowLeadPanel: React.Dispatch<React.SetStateAction<boolean>>;
  showLeadPanel: boolean;
  uniqueStatusList: { status: string }[];
  selectedStatus: string | null;
}
