import * as BPromise from 'bluebird';
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as logger from 'winston';

import { sftpClient } from '../util/sftp';
export async function uploadHandler(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
  const { file } = req.payload;
  if (!file) {
    throw Boom.badData('Failed to read file');
  }
  try {
    const { filename } = file.hapi;
    const sftp = await sftpClient({
      host: process.env.SFTP_HOST,
      port: Number(process.env.SFTP_PORT),
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });
    const uploadStream = sftp.createWriteStream(`${process.env.SFTP_UPLOAD_PATH}/${filename}`);
    file.pipe(uploadStream)
      .on('close', () => reply({ filename }));
  } catch (err) {
    logger.error(err);
    return reply(Boom.badImplementation('There was a problem uploading the file'));
  }
}
