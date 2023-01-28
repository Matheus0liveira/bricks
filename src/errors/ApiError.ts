type Body = {
  error?: string;
} & BodyInit;

export default class APIError extends Error {
  readonly response;
  readonly body: BodyInit;
  constructor(response: Response, body: Body) {
    super();

    this.name = 'APIError';
    this.response = response;
    this.body = body;
    this.message = body?.error || `${response.status} - ${response.statusText}`;
  }
}
