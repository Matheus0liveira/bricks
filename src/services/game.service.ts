export class GameService {
  async sendPosition(position: number) {
    const resp = await fetch('/api/game', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(position),
    });

    if (!resp.ok) throw Error('error for send position');
  }
}
