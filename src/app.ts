import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { venom } from './plugins/venom'
import { queueInfo } from './routes/queue-info'
import { sendMessageToQueue } from './routes/send-message-to-queue'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(venom)

app.register(queueInfo)
app.register(sendMessageToQueue)

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server listening on port 3000')
  })
