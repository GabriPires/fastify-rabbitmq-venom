# Fastify API with RabbitMQ for WhatsApp Message Sending

This is a simple API built with Fastify that allows sending messages via WhatsApp using Venom Bot and RabbitMQ as a message queue.

## Prerequisites

Before getting started, make sure you have the following installed on your machine:

- Node.js
- npm (Node.js package manager)
- Docker with Docker Compose

## Installation

1. Clone this repository:

```bash
git clone https://github.com/GabriPires/fastify-rabbitmq-venom.git
```

2. Install dependencies:

```bash
cd fastify-rabbitmq-venom
npm install
```

3. Configure RabbitMQ:

Ensure that RabbitMQ is running on your machine using Docker Compose file.

```bash
docker compose up -d
```

## Usage

To start the server, run the following command:

```bash
npm run dev
```

This will start the Fastify server on the default port (3000).

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
