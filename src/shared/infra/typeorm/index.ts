import { createConnections } from 'typeorm';

createConnections().then(() => console.log('All database running 🎲'));
