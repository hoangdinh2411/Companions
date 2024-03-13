import { TypeOfCommodityEnum } from '@repo/shared';

const typeOfCommodities = Object.entries(TypeOfCommodityEnum).map(
  ([key, value]) => ({
    _id: key,
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  })
);
export const typeOfCommodityOptions = typeOfCommodities;

export const typeOfCommodityOptionsForFilter = [
  {
    _id: 'all',
    value: 'all',
    label: 'All',
  },
  ...typeOfCommodities,
];
