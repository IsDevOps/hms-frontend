export interface ResponseType<T> {
  data: T;
  success?: boolean;
  message: string;
  statusCode?: boolean;
}
export interface MetaInfo {
  total: number;
  page: string;
  limit: string;
  totalPages: number;
}

export type ResponseTypeWithPagination<
  T,
  K extends string = 'data',
> = ResponseType<
  {
    [P in K]: T; // if you don't specify key it fals back to data
  } & { meta: MetaInfo }
>;

interface ErrorMsg {
  field: string;
  error: string;
}

export interface ErrorData {
  error: string;
  message: ErrorMsg[];
  statusCode: number;
  success: boolean;
  timestamp: string;
  path: string;
}
