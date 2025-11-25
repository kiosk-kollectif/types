export type ApiGlobalResponse<T extends Object | undefined = undefined> = {
  StatusCode: number;
  message?: string;
  data?: T;
};
