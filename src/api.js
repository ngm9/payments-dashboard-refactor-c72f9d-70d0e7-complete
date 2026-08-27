import { shallowClone } from './utils.js';

export class PaymentsApi {
  static instance;

  static getInstance(options = {}) {
    if (!PaymentsApi.instance) {
      PaymentsApi.instance = new PaymentsApi(options);
    }
    return PaymentsApi.instance;
  }

  constructor({ baseUrl = '/api', cache, eventBus, logger } = {}) {
    this.baseUrl = baseUrl;
    this.cache = cache;
    this.eventBus = eventBus;
    this.logger = logger || { info: () => {}, error: () => {} };
  }

  getToken() {
    try {
      const token = window.sessionStorage.getItem('payments_jwt');
      return token || '';
    } catch (error) {
      this.logger.error('Unable to read token from sessionStorage', error);
      return '';
    }
  }

  async fetchDaily(startDate, endDate, token) {
    const url = `${this.baseUrl}/payments/daily?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
    if (!response.ok) {
      throw new Error(`Daily payments request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async fetchMonthly(startDate, endDate, token) {
    const url = `${this.baseUrl}/payments/monthly?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    });
    if (!response.ok) {
      throw new Error(`Monthly payments request failed with status ${response.status}`);
    }
    const data = await response.json();
    return data;
  }

  async getPaymentBundle(startDate, endDate) {
    const token = this.getToken();
    const cacheKey = `${startDate}:${endDate}`;

    const cached = this.cache ? this.cache.get(cacheKey) : null;
    if (cached) {
      this.logger.info('Serving payments bundle from cache', { cacheKey });
      return shallowClone(cached);
    }

    const daily = await this.fetchDaily(startDate, endDate, token);
    const monthly = await this.fetchMonthly(startDate, endDate, token);

    const bundle = { startDate, endDate, daily, monthly, fetchedAt: Date.now() };
    if (this.cache) {
      this.cache.set(cacheKey, bundle);
    }

    return shallowClone(bundle);
  }
}
