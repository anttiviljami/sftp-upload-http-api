import * as Hapi from 'hapi';
import * as Joi from 'joi';

import { uploadHandler } from './handlers/sftp';

export const routes: Hapi.RouteConfiguration[] = [
  {
    method: 'POST',
    path: '/upload',
    config: {
      tags: ['api'],
      response: {
        schema: Joi.object().keys({}).unknown(),
      },
      handler: uploadHandler,
    },
  },
];
