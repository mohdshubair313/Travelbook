import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"
import type { Auth } from "./auth"

const client = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields<Auth>()
    ]
})

export const authClient = client;
export const { signUp, signIn, signOut, getSession } = client;