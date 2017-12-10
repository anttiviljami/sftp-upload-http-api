import * as Hapi from 'hapi';
import * as Joi from 'joi';

import { uploadHandler } from './handlers/sftp';

export const routes: Hapi.RouteConfiguration[] = [
  {
    method: 'POST',
    path: '/upload',
    config: {
      tags: ['api'],
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
      plugins: {
        'hapi-swagger': {
          payloadType: 'form',
        },
      },
      response: {
        schema: Joi.object().keys({}).unknown(),
      },
      handler: uploadHandler,
    },
  },
];
