import Server from './server';

async function start(): Promise<void> {
  const server: Server = new Server();
  await server.initialize();
  server.open(8080);
}

start();