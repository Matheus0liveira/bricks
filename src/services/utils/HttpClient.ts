import APIError from '@/errors/ApiError';
import { Primitives } from '@/types/primitives';

type Request = Omit<RequestInit, 'body'> & {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: Record<string, Primitives>;
};

class HttpClient {
  constructor(private readonly baseURL: string) {}

  get(path: string, options: Request) {
    return this.makeRequest(path, {
      method: 'GET',
      headers: options?.headers,
    });
  }

  post<T = any>(path: string, options: Request) {
    return this.makeRequest<T>(path, {
      method: 'POST',
      body: options?.body,
      headers: options?.headers,
    });
  }

  private async makeRequest<T = any>(
    path: string,
    options: Request
  ): Promise<T> {
    const headers = new Headers();

    if (options.body) {
      headers.append('Content-Type', 'application/json');
    }

    if (options.headers) {
      Object.entries(options.headers).forEach(([name, value]) => {
        headers.append(name, value);
      });
    }

    const response = await fetch(`${this.baseURL}${path}`, {
      method: options.method,
      body: JSON.stringify(options.body),
      headers,
    });

    let body = null;

    const contentTypeHeaders = response.headers.get('Content-Type');

    if (contentTypeHeaders?.includes('application/json')) {
      body = await response.json();
    }

    if (response.ok) {
      return body as T;
    }

    throw new APIError(response, body);
  }
}

export default HttpClient;
