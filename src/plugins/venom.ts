import type { FastifyInstance } from 'fastify'
import { create } from 'venom-bot'

export const defaultQueue = 'queue'

export async function venom(app: FastifyInstance) {
  const venomClient = await create({
    session: defaultQueue,
  })

  venomClient.onMessage(async (message) => {
    if (message.isGroupMsg && message.type === 'add') {
      console.log('Group added', message.chat.groupMetadata, message.chat.name)
    }
  })

  app.decorate('venom', venomClient)
}
