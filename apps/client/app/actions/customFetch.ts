// import { enqueueSnackbar } from "notistack";
import { getToken, removeToken } from './tokens';

export const API_URL = process.env.BASE_API || 'http://localhost:2703/api/v1';
export interface IResponse<T> {
  data?: T;
  message?: string;
  status?: number;
  success: boolean;
}
export default async function customFetch<T>(
  url: string,
  // `RequestInit` is a type for configuring
  // a `fetch` request. By default, an empty object.
  config: any = {},
  needToken = false
  // This function is async, it will return a Promise:
): Promise<IResponse<T>> {
  // Inside, we call the `fetch` function with
  // a URL and config given:
  let token = '';
  if (needToken) {
    token = await getToken();
  }
  const controller = new AbortController();
  const timeout: number = 10000;

  const id = setTimeout(() => controller.abort(), timeout);
  if (config.headers) {
    delete config.headers['Content-Type'];
  } else {
    config.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }
  return (
    fetch(API_URL + url, {
      ...config,
      signal: controller.signal,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    })
      // When got a response call a `json` method on it
      .then((response) => {
        clearTimeout(id);
        return response.json();
      })
      .then((data) => {
        return data as IResponse<T>;
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        return error;
      })
  );
}
