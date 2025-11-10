export interface Hub {
  id: string;
  branchName: string;
  location: string;
  address?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  capacity?: string;
  services?: string[];
  status?: string;
  createdAt?: string;
}
