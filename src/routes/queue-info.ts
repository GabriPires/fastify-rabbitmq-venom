import type { Connection } from 'amqplib'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { amqpConnection } from '@/lib/amqp'
import { defaultQueue } from '@/plugins/venom'

export async function queueInfo(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/queue/info',
    {
      schema: {
        querystring: z.object({
          queue: z.string().optional(),
        }),
      },
    },
    async (request, reply) => {
      let connection: Connection | null = null

      try {
        const { queue } = request.query

        connection = await amqpConnection()
        const channel = await connection.createChannel()

        const queueInfo = await channel.assertQueue(queue ?? defaultQueue, {
          durable: true,
        })

        reply.send(queueInfo)
      } catch (error) {
        reply.status(500).send({ message: 'Failed to load queue info.' })
      } finally {
        setTimeout(async () => {
          if (connection) {
            await connection.close()
          }
        }, 500)
      }
    },
  )
}
