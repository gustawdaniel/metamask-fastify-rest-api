import {FastifyReply, FastifyRequest} from "fastify";
import {prisma} from "../storage/prisma";
import {uid} from "uid";
import {tokenizeUser, verifyUser} from "../auth/getUser";

export class User {
    static async root(req: FastifyRequest, res: FastifyReply) {
        return req.user;
    }

    static async register(req: FastifyRequest<{
        Body: {
            address: string
        }
    }>, res: FastifyReply) {
        const found = await prisma.users.findUnique({
            where: {
                address: req.body.address
            }
        })

        if (found) return res.code(200).send({
            nonce: found.nonce
        });

        const nonce = uid(20);
        await prisma.users.create({
            data: {
                address: req.body.address,
                nonce,
            }
        })

        return res.code(201).send({
            nonce
        });
    }

    static async getNonce(req: FastifyRequest<{ Params: { address: string } }>, res: FastifyReply) {
        const address = req.params.address;

        const user = await prisma.users.findUnique({
            where: {
                address
            }
        })

        if (!user) return res.notFound()

        return {
            nonce: user.nonce
        }
    }

    static async login(req: FastifyRequest<{
        Body: { address: string, sig: string, nonce: string }
    }>, res: FastifyReply) {
        const {address, sig, nonce} = req.body

        if (!address || !sig || !nonce) return res.expectationFailed('invalid body');

        const verified = verifyUser({address, nonce}, sig);
        if (!verified) return res.unauthorized();


        return {
            token: tokenizeUser({address})
        }
    }
}
