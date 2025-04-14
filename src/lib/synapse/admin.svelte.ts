import { PUBLIC_HOMESERVER } from '$env/static/public';

export const API_BASE = `${PUBLIC_HOMESERVER}/_synapse/admin/v1`

import { createSessionStore } from '$lib/store/session.svelte';
let session_store = createSessionStore();

let access_token = $derived.by(() => {
    return session_store?.access_token;
})

export const getRooms = async () => {
    if (!API_BASE || !access_token) {
        throw new Error('No base provided');
    }

    const url = `${API_BASE}/rooms`;

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

