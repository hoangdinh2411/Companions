import NodeCache from 'node-cache';

class MemoryCache<T> {
  nodeCache: NodeCache;
  constructor(options?: NodeCache.Options) {
    this.nodeCache = new NodeCache(options);
  }

  get(key: string): T | undefined {
    return this.nodeCache.get<T>(key);
  }

  set(key: string, value: T, ttl: number): boolean {
    return this.nodeCache.set(key, value, ttl);
  }

  del(key: string): void {
    this.nodeCache.del(key);
  }

  update(key: string, callback: (value: T | undefined) => T) {
    const value = this.get(key) as T | undefined;
    console.log('update', value);

    if (!value) return;
    const updatedValue = callback(value);
    this.del(key);
    this.set(key, updatedValue, 60);
  }
}

export default MemoryCache;
