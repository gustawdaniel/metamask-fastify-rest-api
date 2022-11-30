import fastify, {FastifyError, FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {Version} from "./routes/version";
import {User} from "./routes/user";
import fastifySensible from "@fastify/sensible";
import {getUser} from "./auth/getUser";
import {JWTUser} from "./interfaces/context";
import cors from '@fastify/cors'
import {isNativeError} from "util/types";
import {red, yellow} from 'cli-color'

declare module 'fastify' {
    interface FastifyRequest {
        user: JWTUser | null
    }
}

async function auth(request: FastifyRequest, reply: FastifyReply) {
    const token = (request.headers.authorization || '').replace(/Bearer\s+/, '') || undefined
    request.user = getUser(token)
    if (!request.user) reply.unauthorized()
}

function shouldPrintError(error: FastifyError) {
    return process.env.NODE_ENV !== 'test' && (!error.statusCode || !(error.statusCode >= 400 && error.statusCode < 500))
}

export function getFastifyServer(): FastifyInstance {
    const app = fastify({})

    app.register(fastifySensible)
    app.register(cors)

    app.addHook('onError', async (request, reply, error) => {
        if (shouldPrintError(error)) {
            console.log(red(error), yellow(String(error.stack).replace(`Error: ${error.message}`, '')))
        }
        if (isNativeError(error)) {
            return reply.internalServerError(error.message)
        }
        throw error
    })

    app.get('/me', {preValidation: [auth]}, User.root)
    app.post('/login', User.login)
    app.post('/register', User.register)
    app.get('/users/:address/nonce', User.getNonce)
    app.get('/', Version.root)


    return app
}
