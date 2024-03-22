import { getToken } from './tokens';

export const API_URL =
  process.env.NEXT_PUBLIC_NODE_ENV === 'prod' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:2703';

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
  // let token = '';
  // if (needToken) {
  //   token = await getToken();
  // }
  const controller = new AbortController();
  const timeout: number = 10000;
  let token = '';
  if (needToken) {
    token = await getToken();
  }
  const id = setTimeout(() => controller.abort(), timeout);
  if (config.headers) {
    delete config.headers['Content-Type'];
  } else {
    config.headers = {
      'Content-Type': 'application/json',
    };
  }
  return (
    fetch(API_URL + '/api/v1' + url, {
      ...config,
      signal: controller.signal,
      headers: {
        ...config.headers,
        Cookie: `token=${token}`,
      },
      credentials: 'include',
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
