export interface DashboardKPIs {
  activeUsers: number;
  validatedApplicants: number;
  publishedTools: number;
  monthlyRentals: number;
  todayStats: TodayStats;
}

export interface TodayStats {
  materialHandover: number;
  expectedReturns: number;
  activeReservations: number;
  overdue: number;
}

export interface MonthlyRevenueStats {
  month: string;
  revenue: number;
  commission: number;
}
