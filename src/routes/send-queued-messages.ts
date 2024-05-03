import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { connectRabbitMQ } from '@/lib/amqp'
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
      const { queue } = request.body

      const channel = await connectRabbitMQ(queue)

      try {
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
          await channel.close()
        }, 500)
      }
    },
  )
}
