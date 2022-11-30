import fastify, {FastifyInstance} from "fastify";
import {Version} from "./routes/version";
import {User} from "./routes/user";
import fastifySensible from "@fastify/sensible";

export function getFastifyServer(): FastifyInstance {
    const app = fastify({})

    app.register(fastifySensible)

    app.post('/login', User.login)
    app.post('/register', User.register)
    app.get('/users/:address/nonce', User.getNonce)
    app.get('/', Version.root)


    return app
}
