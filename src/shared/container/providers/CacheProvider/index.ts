import { container } from 'tsyringe';
import ICacheProvider from './models/ICacheProvider';
import CacheProvider from './implementations/RedisCacheProvider';

const providers = {
  redis: CacheProvider,
};
container.registerSingleton<ICacheProvider>('CacheProvider', providers.redis);
