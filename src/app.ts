import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { venomPlugin } from './plugins/venom'
import { clearQueue } from './routes/clear-queue'
import { queueInfo } from './routes/queue-info'
import { sendMessageToQueue } from './routes/send-message-to-queue'
import { sendQueuedMessages } from './routes/send-queued-messages'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(venomPlugin)

app.register(queueInfo)
app.register(sendMessageToQueue)
app.register(clearQueue)
app.register(sendQueuedMessages)

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server listening on port 3000')
  })
