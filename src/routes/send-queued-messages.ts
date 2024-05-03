import type { Connection } from 'amqplib'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { amqpConnection } from '@/lib/amqp'
import { deliverMessage } from '@/utils/deliver-message'

export async function sendQueuedMessages(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/queue/send',
    {
      schema: {
        body: z.object({
          queue: z.string(),
        }),
      },
    },
    async (request, reply) => {
      let connection: Connection | null = null

      try {
        const { queue } = request.body

        connection = await amqpConnection()
        const channel = await connection.createChannel()

        const asserts = await channel.assertQueue(queue, { durable: true })

        if (asserts.messageCount > 0) {
          for (let i = 0; i < asserts.messageCount; i++) {
            const message = await channel.get(queue, { noAck: false })

            if (message) {
              await deliverMessage(app, message, channel)
            }
          }
        }

        reply
          .status(201)
          .send({ message: `Messages sent from queue ${queue}.` })
      } catch (error) {
        reply.status(500).send({ message: 'Failed to send message to queue.' })
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
