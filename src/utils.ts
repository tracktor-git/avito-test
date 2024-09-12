export const formatNumber = (n: number, type: 'price' | 'number' = 'price') => {
  const formatter = new Intl.NumberFormat('ru-RU', {
    style: type === 'price' ? 'currency' : undefined,
    currency: 'RUB',
    minimumFractionDigits: 0, // Убираем копейки, если они не нужны
    maximumFractionDigits: 2, // Оставляем копейки, если они есть
  });

  // Проверяем, есть ли дробная часть
  const hasFraction = n % 1 !== 0;

  // Меняем количество знаков после запятой, если есть дробная часть
  formatter.resolvedOptions().minimumFractionDigits = hasFraction ? 2 : 0;

  return formatter.format(n);
};

// eslint-disable-next-line
export const debounce = <T extends (...args: A[]) => void, A>(callback: T, delay = 300): (...args: A[]) => void => {
  let timerId: ReturnType<typeof setTimeout> | null = null; // eslint-disable-line

  return function debounced(...args: A[]) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};
