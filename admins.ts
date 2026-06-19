import { ToolRequestInfo } from './tools';
import { User } from './users';
import { DashboardKPIs, MonthlyRevenueStats } from './dashboard';
import { PaginatedResult } from './pagination.types';

export type PendingRequest =
  | {
      type: 'applicant_request';
      request_id: string;
      user: User;
      createdAt: string;
    }
  | {
      type: 'tool_request';
      tool: ToolRequestInfo;
      createdAt: string;
    };

export interface RecentActivityItem {
  id: string;
  user: User;
  action: string;
  entityType: string;
  note: string | null;
  time: string;
}

export interface AdminAnalytics {
  kpis: DashboardKPIs;
  monthlyRevenue: MonthlyRevenueStats[];
  recentActivity: RecentActivityItem[];
  reviewQueue: PaginatedResult<PendingRequest>;
}

export interface UserActivityLog {
  id: string;
  action: string;
  entityType: string;
  note: string | null;
  time: string;
}
