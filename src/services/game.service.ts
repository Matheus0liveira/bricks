import HttpClient from './utils/HttpClient';

export class GameService {
  async sendPosition(position: number) {
    const httpClient = new HttpClient('http://localhost:3000');
    await httpClient.post('/api/game', { body: { position } });
  }
}
