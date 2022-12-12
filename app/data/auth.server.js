import { hash, compare } from "bcryptjs";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./database.server";

const SESSION_SECRET=process.env.SESSION_SECRET;

const sessionStorage = createCookieSessionStorage({
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        secrets: [SESSION_SECRET],
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        httpOnly: true,
    }
});

async function createUserSession(userId, redirectPath) {
    const session = await sessionStorage.getSession();
    session.set('userId', userId);
    console.log("Inside createUserSession");
    return redirect(redirectPath, {
        headers: {
            'Set-Cookie': await sessionStorage.commitSession(session),
        },
    });
}

export async function getUserFromSession(request){
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    );
    const userId = session.get("userId");

    if(!userId) {
        return null;
    }
    return userId;
}

export async function requireUserSession(request){
    const userId = await getUserFromSession(request);
    if (!userId) {
        throw redirect('/auth?mode=login');
    }

}

export async function destroyUserSession(request) {
    const session = await sessionStorage.getSession(
        request.headers.get('Cookie')
    );

    return redirect('/', {
        headers: {
            'Set-Cookie': await sessionStorage.destroySession(session),
        }
    });
}

export async function signup({email, password}) {
    const existingUser = await prisma.user.findFirst({where: {email}});
    
    if (existingUser) {
        const error = new Error("A User already exists with the entered email.");
        error.status = 422;
        throw error;
    }

    const hashedPassword = await hash(password,12);
    const user = await prisma.user.create({data: {email: email, password: hashedPassword}});

    return createUserSession(user.id, '/expenses');
}

export async function login({email, password}) {
    const existingUser = await prisma.user.findFirst({where: {email}});

    if (!existingUser) {
        console.log("user does not exist");
        const error = new Error("User does not exist.");
        error.status = 401;
        throw error;
    }

    const correctPassword = await compare(password, existingUser.password);

    if (!correctPassword) {
        console.log("password does not match");
        const error2 = new Error("Cannot validate user");
        error2.status = 401;
        throw error2;
    }

    return await createUserSession(existingUser.id, '/expenses');
}