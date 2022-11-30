import { getFastifyServer } from '../src/fastify'
import {seed} from "../src/storage/seed";
import {prisma} from "../src/storage/prisma";

describe('searching user by address', () => {
  it('address not found', async () => {
    await seed();

    const server = await getFastifyServer()
    const result = await server.inject({
      method: 'GET',
      path: '/users/abc/nonce',
    })


    expect(result.statusCode).toEqual(404);
    expect(result.body).toEqual(JSON.stringify({
      statusCode: 404,
      error: "Not Found",
      message: "Not Found"
    }))
  })

  it('address found and nonce is correct', async () => {
    await prisma.users.upsert({
      where: {
        address: "abc"
      },
      create: {
        address: "abc",
        nonce: "secret"
      },
      update: {
        nonce: "secret"
      }
    })

    const server = await getFastifyServer()
    const result = await server.inject({
      method: 'GET',
      path: '/users/abc/nonce',
    })

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({
      nonce: 'secret'
    }))

  })
})
