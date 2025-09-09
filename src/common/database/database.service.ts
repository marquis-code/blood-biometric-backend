import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onModuleInit() {
    this.connection.on('connected', () => {
      this.logger.log('Connected to MongoDB');
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('Disconnected from MongoDB');
    });

    this.connection.on('error', (error) => {
      this.logger.error('MongoDB connection error:', error);
    });
  }

  async getConnectionStatus(): Promise<string> {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    return states[this.connection.readyState] || 'unknown';
  }

  async getDatabaseStats() {
    const db = this.connection.db;
    const stats = await db.stats();
    return {
      database: db.databaseName,
      collections: stats.collections,
      documents: stats.objects,
      dataSize: stats.dataSize,
      indexSize: stats.indexSize,
      storageSize: stats.storageSize,
    };
  }
}