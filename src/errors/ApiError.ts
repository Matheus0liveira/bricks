type Body = {
  error?: string;
} & BodyInit;

type MyResponse = {
  status: number;
} & Partial<Response>;

export default class APIError extends Error {
  readonly response;
  readonly body?: BodyInit;
  constructor(response: MyResponse, body?: Body) {
    super();

    this.name = 'APIError';
    this.response = response;
    this.body = body;
    this.message = body?.error || `${response.status} - ${response.statusText}`;
  }
}
