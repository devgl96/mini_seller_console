export interface OpportunityProps {
  id: number;
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
}

export interface LeadProps {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: string;
  stage?: string;
  amount?: number;
  accountName?: string;
}

export interface StatusListProps {
  status: string;
  checked: boolean;
}

export type TypeSortScoreProps = "asc" | "desc" | null;
