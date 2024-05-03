import type { Channel, GetMessage } from 'amqplib'
import type { FastifyInstance } from 'fastify'

type Message = {
  to: string
  message: string
}

export async function deliverMessage(
  app: FastifyInstance,
  queueMessage: GetMessage,
  channel: Channel,
) {
  try {
    const { to, message } = JSON.parse(
      queueMessage.content.toString(),
    ) as Message

    const venom = app.venom

    const result = await venom.sendText(to, message)

    if (result) {
      channel.ack(queueMessage)
    }

    console.log('Message delivered:', result)
  } catch (error) {
    console.error('Failed to deliver message:', error)
    channel.nack(queueMessage)
  }
}
