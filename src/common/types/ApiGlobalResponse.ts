export type ApiGlobalResponse<T = any> = {
  StatusCode: number;
  message?: string;
  data?: T;
};
