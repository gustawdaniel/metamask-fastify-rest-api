import pJson from '../package.json'
import { getFastifyServer } from '../src/fastify'

const correctVersion = { name: pJson.name, version: pJson.version }

describe('i can read version', () => {
  it('from rest api', async () => {
    const server = await getFastifyServer()
    const result = await server.inject({
      method: 'GET',
      path: '/',
    })

    expect(result.body).toEqual(JSON.stringify(correctVersion))
    expect(result.statusCode).toEqual(200)
    expect(result.headers['content-type']).toContain('application/json')
  })
})
