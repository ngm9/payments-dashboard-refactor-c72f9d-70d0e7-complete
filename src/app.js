import { PaymentsApi } from './api.js';
import { createEventBus } from './events.js';
import { createCache } from './cache.js';
import { renderDashboard } from './components/exampleComponent.js';
import { createLogger } from './services/logger.js';

const eventBus = createEventBus();
const cache = createCache('payments');
const logger = createLogger('PaymentsDashboard');

const api = PaymentsApi.getInstance({
  baseUrl: '/api',
  cache,
  eventBus,
  logger
});

const state = {
  startDate: null,
  endDate: null,
  loading: false
};

const getElement = (id) => document.getElementById(id);

const setLoading = (isLoading) => {
  state.loading = isLoading;
  const refreshButton = getElement('refresh-btn');
  if (refreshButton) {
    refreshButton.disabled = isLoading;
  }
  eventBus.emit('ui:loading-changed', { loading: isLoading });
};

const setErrorBanner = (message) => {
  const banner = getElement('error-banner');
  if (!banner) return;
  if (!message) {
    banner.style.display = 'none';
    banner.textContent = '';
    return;
  }
  banner.textContent = message;
  banner.style.display = 'block';
};

const handleBundleLoaded = (bundle) => {
  const root = getElement('dashboard');
  if (!root) return;
  renderDashboard(root, bundle, { loading: state.loading });
};

const handleBundleError = (error) => {
  logger.error('Failed to load payments bundle', error);
  setErrorBanner('Failed to load payments. Please try again later.');
};

const loadBundle = async () => {
  if (!state.startDate || !state.endDate) {
    return;
  }
  setErrorBanner(null);
  setLoading(true);

  try {
    const bundle = await api.getPaymentBundle(state.startDate, state.endDate);
    eventBus.emit('payments:bundle-loaded', bundle);
  } catch (error) {
    eventBus.emit('payments:bundle-error', error);
  } finally {
    setLoading(false);
  }
};

const wireEvents = () => {
  const startInput = getElement('start-date');
  const endInput = getElement('end-date');
  const refreshButton = getElement('refresh-btn');

  if (startInput) {
    startInput.addEventListener('change', () => {
      state.startDate = startInput.value || null;
    });
  }

  if (endInput) {
    endInput.addEventListener('change', () => {
      state.endDate = endInput.value || null;
    });
  }

  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      loadBundle();
    });
  }

  eventBus.on('payments:bundle-loaded', handleBundleLoaded);
  eventBus.on('payments:bundle-error', handleBundleError);
};

const setInitialDates = () => {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7);

  const startInput = getElement('start-date');
  const endInput = getElement('end-date');

  const toInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (startInput) {
    startInput.value = toInputValue(start);
    state.startDate = startInput.value;
  }

  if (endInput) {
    endInput.value = toInputValue(today);
    state.endDate = endInput.value;
  }
};

const init = () => {
  wireEvents();
  setInitialDates();
  loadBundle();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
