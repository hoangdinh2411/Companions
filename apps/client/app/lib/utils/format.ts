export function formatToSwedenCurrency(value: number): string {
  if (value === 0) {
    return 'FREE';
  }
  return new Intl.NumberFormat('sv-SV', {
    style: 'currency',
    currency: 'SEK',
    currencyDisplay: 'symbol',
  }).format(value);
}

export function formatWeight(value: number): string {
  return Number(value).toFixed(2) + ' kg';
}
