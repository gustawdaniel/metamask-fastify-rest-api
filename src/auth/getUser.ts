import {utils} from "ethers";
import { users} from "@prisma/client";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken'
import {JWTUser} from "../interfaces/context";

const jwtKey = process.env.JWT_SECRET_KEY ?? 'test';
const issuer = 'I <3 web3'; // name of organization

interface JwtPayloadCustomer {
    iss: string
    iat: number
    exp: number
    sub: string
}

function getExpDate(jwtPayload: { exp: number }): Date {
    return dayjs.unix(jwtPayload.exp).toDate()
}

export function getUser(token?: string): JWTUser | null {
    if (!token) {
        return null
    } else {
        token = token.replace(/^Bearer\s+/, '')

        const jwtPayload = jwt.verify(token, jwtKey) as unknown as JwtPayloadCustomer

        const sub = jwtPayload.sub

        return {
            address: sub,
            token_expiring_at: getExpDate(jwtPayload),
        }
    }
}

export function tokenizeUser(user: Pick<users, 'address'>): string {
    return jwt.sign({
        sub: user.address,
        iss: issuer,
        exp: dayjs().add(1, 'month').unix()
    }, jwtKey)
}

export function getAddress(nonce: string, signature: string): string {
    return utils.verifyMessage(nonce, signature).toLowerCase()
}

export function verifyUser(user: Pick<users, 'nonce' | 'address'>, signature: string): boolean {
    try {
        return getAddress(user.nonce, signature) === user.address;
    } catch {
        return false;
    }
}
