import fs from 'fs';
import path from 'path';
import dayjs from 'dayjs';
export const logEvent = function (message: string) {
  try {
    let folderName = `${path.resolve(process.cwd())}/logs`;
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true });
    }

    let fileName = `${folderName}/${dayjs().format('DD/MM/YYYY').replaceAll('/', '-')}.log`;
    let timeLog = dayjs().format('hh:mm:ss A');
    let content = `${timeLog} --> ${message}\n`;
    fs.appendFileSync(fileName, content);
  } catch (error) {
    console.log('logEvent error:::', error);
  }
};
