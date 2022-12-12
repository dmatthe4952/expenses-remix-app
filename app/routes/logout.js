import { json } from "@remix-run/node";
import { destroyUserSession } from "~/data/auth.server";

export async function action({request}){
    if (request.method !== "POST") {
        throw json({ message: "Invalid request method." }, { status: 400 });
    }

    console.log("About to destroy session");

    const response = await destroyUserSession(request);
    console.log("Response", response.url, response.status);
    return response;

}