import { createSessionStore } from '$lib/store/session.svelte';
let session_store = createSessionStore();

let access_token = $derived.by(() => {
    return session_store?.access_token;
})


export let auth_metadata: {
    issuer: string | undefined
} = $state({
    issuer: undefined
})

export function setIssuer(issuer: string) {
    auth_metadata.issuer = issuer;
}

let issuer = $derived(auth_metadata?.issuer)

let api_base = $derived.by(() => {
    return `${issuer}api/admin/v1`
})

export const getUsers = async () => {
    if (!api_base || !access_token) {
        throw new Error('No base provided');
    }

    const url = `${api_base}/users`;

    const options: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    }

    try {
        const response = await fetch(url, options)
        return response.json();
    } catch (error) {
        throw error
    }
}

