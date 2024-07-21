import axios, { AxiosRequestConfig } from 'axios'

// const cached: Map<string, any> = new Map()

class Cache {
  cache = new Map<string, any>()
  cacheKey = 'fetch-cache'

  constructor() {
    const localCacheRaw = localStorage.getItem(this.cacheKey)
    if (localCacheRaw) {
      const entries = Object.entries(JSON.parse(localCacheRaw))
      for (const [key, value] of entries) {
        this.cache.set(key, value)
      }
    }
  }

  private persistent() {
    localStorage.setItem(
      this.cacheKey,
      JSON.stringify(Object.fromEntries(this.cache))
    )
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  load(key: string): any {
    return JSON.parse(this.cache.get(key))
  }

  store(key: string, value: any) {
    this.cache.set(key, JSON.stringify(value))
    this.persistent()
  }
}

const cache = new Cache()

async function fetchWithCache(
  url: string,
  config?: AxiosRequestConfig<any> | undefined
) {
  if (cache.has(url)) {
    console.log('Cached', url)
    return cache.load(url)
  }
  console.log('Fetch', url)
  const response = await axios.get(url, config)
  cache.store(url, response)
  return response
}

export { fetchWithCache }
