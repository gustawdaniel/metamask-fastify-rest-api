import { getFastifyServer } from './fastify'

async function main() {
    const app = await getFastifyServer()
    await app.listen({ port: 4200, host: '0.0.0.0' })
    console.log(`Fastify listen on http://localhost:4200/`)
}

main().catch(console.error)
