import amqplib from 'amqplib'

export async function amqpConnection() {
  return await amqplib.connect('amqp://localhost')
}
