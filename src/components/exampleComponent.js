import { formatCurrency, formatInteger, safeText } from '../utils.js';

const clearElement = (element) => {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

const createSummaryRow = (label, value) => {
  const row = document.createElement('div');
  row.className = 'summary-row';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = safeText(label);

  const valueSpan = document.createElement('span');
  valueSpan.textContent = safeText(value);

  row.appendChild(labelSpan);
  row.appendChild(valueSpan);

  return row;
};

const renderDailyPanel = (container, daily) => {
  clearElement(container);

  if (!daily) {
    const empty = document.createElement('div');
    empty.className = 'loading';
    empty.textContent = 'No daily data available.';
    container.appendChild(empty);
    return;
  }

  const totalAmount = formatCurrency(daily.totalAmount);
  const totalCount = formatInteger(daily.totalCount);

  container.appendChild(createSummaryRow('Total amount', totalAmount));
  container.appendChild(createSummaryRow('Total transactions', totalCount));
};

const renderMonthlyPanel = (container, monthly) => {
  clearElement(container);

  if (!monthly) {
    const empty = document.createElement('div');
    empty.className = 'loading';
    empty.textContent = 'No monthly data available.';
    container.appendChild(empty);
    return;
  }

  const totalAmount = formatCurrency(monthly.totalAmount);
  const totalCount = formatInteger(monthly.totalCount);

  container.appendChild(createSummaryRow('Total amount', totalAmount));
  container.appendChild(createSummaryRow('Total transactions', totalCount));
};

export const renderDashboard = (root, bundle, { loading }) => {
  const dailyContainer = document.getElementById('daily-content');
  const monthlyContainer = document.getElementById('monthly-content');

  if (!dailyContainer || !monthlyContainer) {
    return;
  }

  if (loading) {
    clearElement(dailyContainer);
    clearElement(monthlyContainer);

    const dailyLoading = document.createElement('div');
    dailyLoading.className = 'loading';
    dailyLoading.textContent = 'Loading daily payments...';
    dailyContainer.appendChild(dailyLoading);

    const monthlyLoading = document.createElement('div');
    monthlyLoading.className = 'loading';
    monthlyLoading.textContent = 'Loading monthly payments...';
    monthlyContainer.appendChild(monthlyLoading);
    return;
  }

  if (!bundle) {
    clearElement(dailyContainer);
    clearElement(monthlyContainer);
    const dailyEmpty = document.createElement('div');
    dailyEmpty.className = 'loading';
    dailyEmpty.textContent = 'No data loaded yet.';
    dailyContainer.appendChild(dailyEmpty);
    const monthlyEmpty = document.createElement('div');
    monthlyEmpty.className = 'loading';
    monthlyEmpty.textContent = 'No data loaded yet.';
    monthlyContainer.appendChild(monthlyEmpty);
    return;
  }

  renderDailyPanel(dailyContainer, bundle.daily);
  renderMonthlyPanel(monthlyContainer, bundle.monthly);
};
