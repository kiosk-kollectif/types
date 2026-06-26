export enum StatsPeriod {
  SEVEN_DAYS = '7d',
  ONE_MONTH = '1m',
  THREE_MONTHS = '3m',
  ONE_YEAR = '1y',
}

export interface KpiItem<T = number | string> {
  value: T;
  change: string;
  changeDir: 'up' | 'down';
  sub?: string;
}

export interface ChartDataPoint {
  l: string; // Label (e.g. day or month)
  v: number; // Value
}

export interface TopToolStat {
  name: string;
  cat: string;
  count: number;
  rev: string;
}

export interface KioskStat {
  name: string;
  rentals: number;
  revenue: string;
  depositors: number;
}

export interface DashboardStatsResponse {
  kpis: {
    activeUsers: KpiItem<number>;
    validatedDepositors: KpiItem<number>;
    publishedTools: KpiItem<number>;
    periodRentals: KpiItem<number>;
    periodRevenue: KpiItem<string>;
  };
  charts: {
    rentals: ChartDataPoint[];
    revenue: ChartDataPoint[];
  };
  tables: {
    topTools: TopToolStat[];
    kioskStats: KioskStat[];
  };
}
