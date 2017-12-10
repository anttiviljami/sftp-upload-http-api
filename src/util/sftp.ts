import { Client, ConnectConfig, SFTPWrapper } from 'ssh2';
import { Writable } from 'stream';

export interface SFTPWriteStream extends Writable {
  bytesWritten: number;
}

export async function sftpClient(config: ConnectConfig) {
  return new Promise<SFTPWrapper>((resolve, reject) => {
    const client = new Client();
    client.on('ready', () => {
      client.sftp((err, sftp) => resolve(sftp));
    });
    client.on('error', (err) => reject(err));
    client.connect(config);
  });
}
