import * as BPromise from 'bluebird';
import * as Hapi from 'hapi';
import * as Boom from 'boom';
import * as logger from 'winston';
import * as path from 'path';

import { sftpClient, SFTPWriteStream } from '../util/sftp';
import { SFTPStream } from 'ssh2-streams';

export async function uploadHandler(req: Hapi.Request, reply: Hapi.ReplyNoContinue) {
  const { file } = req.payload;
  if (!file) {
    throw Boom.badData('Failed to read file');
  }
  try {
    const { filename, headers, bytes } = file.hapi;
    const sftp = await sftpClient({
      host: process.env.SFTP_HOST,
      port: Number(process.env.SFTP_PORT),
      username: process.env.SFTP_USER,
      password: process.env.SFTP_PASS,
    });
    const uploadPath = path.join(process.env.SFTP_UPLOAD_PATH, path.basename(filename));
    const uploadStream = sftp.createWriteStream(uploadPath) as SFTPWriteStream;
    file.pipe(uploadStream)
      .on('close', (event: any) => {
        const { bytesWritten } = uploadStream;
        reply({ path: uploadPath, bytes: bytesWritten });
      });
  } catch (err) {
    logger.error(err);
    return reply(Boom.badImplementation('There was a problem uploading the file'));
  }
}
