import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { uploadHandler } from './handlers/sftp';

export const routes: Hapi.RouteConfiguration[] = [
  {
    method: 'POST',
    path: '/upload',
    config: {
      tags: ['api'],
      description: 'Takes in HTTP upload and streams it via SFTP to remote server',
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: Number(process.env.UPLOAD_MAX_BYTES || 10485760),
      },
      validate: {
        payload: {
          file: Joi.any()
            .meta({ swaggerType: 'file' })
            .description('upload file'),
        },
      },
      response: {
        status: {
          200: Joi.object().keys({
            path: Joi.string().description('Remote path to uploaded file').example('/path/to/file'),
            bytes: Joi.number().description('File size of uploaded file').example(1024),
          }),
        },
      },
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
        },
      },
      handler: uploadHandler,
    },
  },
];
