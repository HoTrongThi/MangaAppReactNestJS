import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend access
  app.enableCors({ 
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Allow both Vite and React default ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Authorization'],
    credentials: true 
  });

  // Add global prefix
  app.setGlobalPrefix('api');
  
  await app.listen(3001);
  console.log('Server is running on port 3001');
}
bootstrap();
