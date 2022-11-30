import {prisma} from "./prisma";

export async function seed() {
    await prisma.users.deleteMany();
}
