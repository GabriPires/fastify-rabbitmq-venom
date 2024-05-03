import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { connectRabbitMQ } from '@/lib/amqp'

export async function sendMessageToQueue(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/message',
    {
      schema: {
        body: z.object({
          message: z.string(),
          to: z.string(),
          queue: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { to, message, queue } = request.body

      const channel = await connectRabbitMQ(queue)

      try {
        await channel.assertQueue(queue, { durable: true })

        channel.sendToQueue(queue, Buffer.from(JSON.stringify({ to, message })))

        reply.status(201).send({ message: 'Message sent to queue.' })
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
