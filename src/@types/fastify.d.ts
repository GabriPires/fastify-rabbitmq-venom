// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fastify from 'fastify'
import type { Whatsapp } from 'venom-bot'

declare module 'fastify' {
  export interface FastifyInstance {
    venom: Whatsapp
  }
}
