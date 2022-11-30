import {utils} from "ethers";
import { users} from "@prisma/client";
import dayjs from "dayjs";
import jwt from 'jsonwebtoken'

const jwtKey = process.env.JWT_SECRET_KEY ?? 'test';
const issuer = 'I <3 web3'; // name of organization

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
