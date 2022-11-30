import { getFastifyServer } from '../src/fastify'
import {seed} from "../src/storage/seed";
import {prisma} from "../src/storage/prisma";
import {tokenizeUser} from "../src/auth/getUser";

const address = 'abc';

describe('i can see my account', () => {
    it('using token', async () => {
        await seed();
        prisma.users.create({
            data: {
                address,
                nonce: 'secret'
            }
        })

        const server = await getFastifyServer()
        const result = await server.inject({
            method: 'GET',
            path: '/me',
            headers: {
                authorization: `Bearer ${tokenizeUser({address})}`
            }
        })

        expect(JSON.parse(result.body)).toMatchObject({
            address
        })
        expect(result.statusCode).toEqual(200)
        expect(result.headers['content-type']).toContain('application/json')
    })
})
