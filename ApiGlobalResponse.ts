export type ApiGlobalResponse<T = unknown> = {
  StatusCode: number;
  message?: string;
  data?: T;
};
