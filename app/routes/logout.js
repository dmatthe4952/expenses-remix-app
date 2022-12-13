import { json } from "@remix-run/node";
import { destroyUserSession } from "~/data/auth.server";

export async function action({request}){
    if (request.method !== "POST") {
        throw json({ message: "Invalid request method." }, { status: 400 });
    }

    const response = await destroyUserSession(request);
    return response;

}