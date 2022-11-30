import {verifyUser, getAddress, tokenizeUser} from "../src/auth/getUser";
import {getFastifyServer} from "../src/fastify";
import {seed} from "../src/storage/seed";
import {prisma} from "../src/storage/prisma";
import {Response} from "light-my-request";

const address = '0xa68701d9b3eb52f0a7248e7b57d484411a60b045';
const nonce = '14b2a79636d81fbb10f9';
const signature = '0x5d8f425c91437148b65f47e9444d91e868d3566d868649fec58c76010c8f01992edd2db3284088d5f5048fc3bc9eff307e0cd1b8b1a2e6c96a2784eb5fd5358d1b';


describe('i can authenticate signature', () => {
    it('auth', () => {
        expect(getAddress(nonce, signature)).toEqual(address)
        expect(verifyUser({nonce, address}, signature)).toBeTruthy();
    })

    it('and see his token', async () => {
        await seed();
        await prisma.users.create({
            data: {
                address,
                nonce
            },
        })

        async function login(signature: string): Promise<Response> {
            return server.inject({
                method: 'POST',
                path: '/login',
                payload: {
                    address,
                    sig: signature,
                    nonce
                }
            })
        }

        const server = await getFastifyServer()
        const result1 = await login("abc")

        expect(result1.statusCode).toEqual(401);
        expect(result1.body).toEqual(JSON.stringify({
            statusCode: 401, error: "Unauthorized", message: "Unauthorized"
        }));

        const result2 = await login(signature)

        expect(result2.statusCode).toEqual(200);
        expect(result2.body).toEqual(JSON.stringify({
            token: tokenizeUser({address})
        }));
    })
});
