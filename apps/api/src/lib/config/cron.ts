import nodeCron from 'node-cron';
import env from './env';

export const updateStatus = nodeCron.schedule(
  '0 8 * * *',
  async () => {
    const res = await fetch(env.SERVER + '/api/v1/update-documents');
    console.log('Update status every day at 8:00 AM', res);
    const data = (await res.json()) as any;
    if (!data.success) {
      updateStatus.stop();
    }
  },
  {
    scheduled: true,
  }
);

export const pingServer = nodeCron.schedule(
  '* */13 * * * ',
  async () => {
    await fetch(env.SERVER + '/api/v1/test');
  },
  {
    scheduled: true,
  }
);
