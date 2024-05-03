import type { Connection } from 'amqplib'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { amqpConnection } from '@/lib/amqp'

export async function clearQueue(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/queue/clear',
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

        await channel.assertQueue(queue, { durable: true })

        await channel.consume(
          queue,
          (message) => {
            console.log('Message removed:', message?.content.toString())
          },
          { noAck: true },
        )

        reply.status(201).send({ message: `Queue ${queue} cleared.` })
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
