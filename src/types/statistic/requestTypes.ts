// Request Types for Statistic
import { Request } from 'express';
import { 
  StatisticCreateInput, 
  StatisticUpdateInput 
} from './statisticTypes';

export interface GetAllStatisticsRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    sort?: string;
    isActive?: string;
  };
}

export interface GetStatisticByIdRequest extends Request {
  params: {
    id: string;
  };
}

export interface CreateStatisticRequest extends Request {
  body: StatisticCreateInput;
}

export interface UpdateStatisticRequest extends Request {
  params: {
    id: string;
  };
  body: StatisticUpdateInput;
}

export interface DeleteStatisticRequest extends Request {
  params: {
    id: string;
  };
}