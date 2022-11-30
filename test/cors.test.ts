import {getFastifyServer} from '../src/fastify'

describe('cors', () => {
    it('for get I have access-control-allow-origin', async () => {
        const server = await getFastifyServer()
        const result = await server.inject({
            method: 'GET',
            path: '/',
        })

        expect(result.statusCode).toEqual(200)
        expect(result.headers['access-control-allow-origin']).toEqual('*')
    })

    it('for options I see cors headers', async () => {
        const server = await getFastifyServer()
        const result = await server.inject({
            method: 'OPTIONS',
            path: '/',
            headers: {
                'Access-Control-Request-Method': 'GET',
                'Origin': 'https://ilove.ethereum'
            }
        })

        expect(result.statusCode).toEqual(204)
        expect(result.headers['access-control-allow-origin']).toEqual('*')

    })
})
