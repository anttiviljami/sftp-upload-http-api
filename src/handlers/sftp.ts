import * as Hapi from 'hapi';

export async function uploadHandler(request: Hapi.Request, reply: Hapi.ReplyNoContinue) {
  return reply({ success: true });
}
