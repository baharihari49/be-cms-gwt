// types/statistic/statisticTypes.ts
export interface Statistic {
  id: number;
  icon: string;
  number: string;
  label: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatisticCreateInput {
  icon: string;
  number: string;
  label: string;
  order?: number;
  isActive?: boolean;
}

export interface StatisticUpdateInput {
  icon?: string;
  number?: string;
  label?: string;
  order?: number;
  isActive?: boolean;
}

export interface StatisticQueryOptions {
  skip?: number;
  take?: number;
  orderBy?: any;
  where?: any;
}

