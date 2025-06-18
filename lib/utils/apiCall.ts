import axios, { AxiosRequestConfig, Method } from "axios";
interface ApiRequestParams<T = unknown> {
  url: string;
  method?: Method;
  body?: T;
  headers?: Record<string, string>;
}
export async function apiCall<R = unknown, B = unknown>({
  url,
  method,
  body,
  headers = {},
}: ApiRequestParams<B>): Promise<R> {
  const config: AxiosRequestConfig = {
    url,
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body !== undefined && { data: body }),
  };
  const { data } = await axios.request<R>(config);
  return data;
}
