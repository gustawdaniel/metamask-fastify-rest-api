import {PrismaClient} from "@prisma/client";

function dbUrl() {
    const url = process.env.DATABASE_URL;

    if(!url) throw new Error(`No db url`);

    if(process.env.NODE_ENV === 'test') {
        if(url.includes('?')) {
            throw new Error('test url not implemented for this db')
        }
        return url + '_test'
    } else {
        return url;
    }
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: dbUrl()
        }
    }
})

export {
    prisma,
    PrismaClient
}
