import amqplib from 'amqplib'

import { defaultQueue } from '@/plugins/venom'

export async function connectRabbitMQ(queue = defaultQueue) {
  try {
    const connection = await amqplib.connect('amqp://localhost')
    const channel = await connection.createChannel()

    await channel.assertQueue(queue, { durable: true })

    return channel
  } catch (error) {
    throw new Error('Failed to connect to RabbitMQ.')
  }
}
