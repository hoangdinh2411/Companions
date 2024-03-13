import { StatisticResponse } from '@repo/shared';
import customFetch from './customFetch';

export const fetchStatisticsAndUpdateStatusOldDocuments = async () => {
  return await customFetch<StatisticResponse>('/statistic', {
    method: 'GET',
    next: {
      revalidate: 60 * 60 * 24,
    },
  });
};
