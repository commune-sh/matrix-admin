<script lang="ts">
import { setIssuer, getUsers } from '$lib/mas/admin.svelte';
import { getRooms } from '$lib/synapse/admin.svelte';
import { whoami } from '$lib/matrix/requests';
import { onMount } from 'svelte';

import { createOIDCStore } from '$lib/store/oidc.svelte';
let oidc_store = createOIDCStore();

import { createSessionStore } from '$lib/store/session.svelte';
let session_store = createSessionStore();

let {
    data
}: {
    data: any
} = $props();

let mas = $derived.by(() => {
    return data?.auth_metadata?.issuer
})

$effect(() => {
    if(data) {
        console.log(data)
    }
    if(data?.auth_metadata?.issuer) {
        setIssuer(data.auth_metadata.issuer)
    }
})

let session = $derived.by(() => {
    return session_store?.session
})

onMount(async() => {
    await oidc_store.init()
    if(data?.session && !session) {
        session_store.update(data.session, data.oidc_client_id)
    }
})

async function listUsers() {
    let users = await getUsers();
    console.log(users)
}

async function listRooms() {
    let rooms = await getRooms();
    console.log(rooms)
}

</script>


<div class="flex flex-cols gap-4 p-4">
    <div class="">
        <button onclick={listUsers} class="text-sm">Get Users</button>
    </div>
    <div class="">
        <button onclick={listRooms} class="text-sm">Get Rooms</button>
    </div>
</div>


