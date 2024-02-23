// import { enqueueSnackbar } from "notistack";
import { getToken } from "./tokens";

export const API_URL = "http://localhost:2703/api/v1";
export interface IResponse<T> {
  data: T;
  message?: string;
  status?: number;
  success: boolean;
}
export default async function customFetch<T>(
  url: string,
  // `RequestInit` is a type for configuring
  // a `fetch` request. By default, an empty object.
  config: any = {},
  timeout: number = 10000
  // This function is async, it will return a Promise:
): Promise<IResponse<T>> {
  // Inside, we call the `fetch` function with
  // a URL and config given:
  const token = await getToken();
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  if (config.headers) {
    delete config.headers["Content-Type"];
  } else {
    config.headers = {
      "Content-Type": "application/json",
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
        if (!data.success && data.message) {
          throw new Error(data.message);
        }
        return data as IResponse<T>;
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          throw new Error("Request timeout");
        }
        return error;
      })
  );
}
