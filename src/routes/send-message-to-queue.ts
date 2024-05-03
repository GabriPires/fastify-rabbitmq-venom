import type { Connection } from 'amqplib'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { amqpConnection } from '@/lib/amqp'

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
      let connection: Connection | null = null

      try {
        const { to, message, queue } = request.body

        connection = await amqpConnection()
        const channel = await connection.createChannel()

        await channel.assertQueue(queue, { durable: true })

        channel.sendToQueue(queue, Buffer.from(JSON.stringify({ to, message })))

        reply.status(201).send({ message: 'Message sent to queue.' })
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
