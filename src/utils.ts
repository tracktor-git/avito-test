export const formatNumber = (n: number, type: 'price' | 'number' = 'price') => {
  if (type === 'number') {
    return new Intl.NumberFormat('ru-RU').format(n);
  }

  const formatter = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0, // Убираем копейки, если они не нужны
    maximumFractionDigits: 2, // Оставляем копейки, если они есть
  });

  // Проверка, есть ли копейки
  if (n % 1 === 0) {
    return formatter.format(n); // Целое число без копеек
  }

  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2, // Если есть копейки, показываем 2 знака после запятой
    maximumFractionDigits: 2,
  }).format(n);
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
