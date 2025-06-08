// types/client/clientTypes.ts
export interface Client {
  id: number;
  name: string;
  industry: string;
  image?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientCreateInput {
  name: string;
  industry: string;
  image?: string | null;
  isActive?: boolean;
}

export interface ClientUpdateInput {
  name?: string;
  industry?: string;
  image?: string | null;
  isActive?: boolean;
}

export interface ClientQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: any;
  where?: any;
}

