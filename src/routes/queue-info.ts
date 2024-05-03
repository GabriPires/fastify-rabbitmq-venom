import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { connectRabbitMQ } from '@/lib/amqp'
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
      const { queue } = request.query

      const channel = await connectRabbitMQ(queue)

      try {
        const queueInfo = await channel.assertQueue(queue ?? defaultQueue, {
          durable: true,
        })

        reply.send(queueInfo)
      } catch (error) {
        reply.status(500).send({ message: 'Failed to load queue info.' })
      } finally {
        setTimeout(async () => {
          await channel.close()
        }, 500)
      }
    },
  )
}
