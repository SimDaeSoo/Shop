import { Express, Request, Response, NextFunction } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as SocketIO from 'socket.io';
import { Server } from 'http';
import axios, { AxiosResponse } from 'axios';

class _Server {
  private port!: number;
  private server!: Server;
  private io!: SocketIO.Server;
  private application!: Express;

  public async initialize(): Promise<void> {
    this.application = express();
    this.middleware();
  }

  private middleware(): void {
    this.application.use(bodyParser.json({ limit: '10mb' }));
    this.application.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));

    this.application.all('*', (req: Request, res: Response, next: NextFunction) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With');
      res.header('Access-Control-Allow-Methods', 'POST,GET');
      next();
    });
  }

  public open(port: number): void {
    this.port = port;
    this.server = this.application.listen(this.port);

    this.server.once('error', (err: any): void => {
      if (err.code === 'EADDRINUSE') {
        this.close();
        this.open(++this.port);
      }
    });

    this.server.once('listening', (): void => {
      this.createSocketServer();
    });
  }

  private createSocketServer(): void {
    try {
      this.io = SocketIO(this.server, { serveClient: false });
      this.io.on('connection', (socket: SocketIO.Socket): void => { this.connect(socket); });
      console.log('socket server is running...');
    } catch (error) {
      console.log(error);
    }
  }

  private connect(socket: SocketIO.Socket): void {
    socket.on('disconnect', (): void => { this.disconnect(socket); });
  }

  private disconnect(socket: SocketIO.Socket): void {
  }

  public close(): void {
    this.server.close();
  }
}

export default _Server;