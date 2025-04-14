<script lang="ts">
import { getAuthMetadata, registerOauthClient } from '$lib/matrix/requests'

import { onMount, tick } from "svelte";

onMount(() => {
    focusInput();
});

async function focusInput() {
    await tick();
    if(input) {
        input.focus();
    }
}

let { data } = $props();

let url = $derived.by(() => {
    return data.url;
});

let issuer = $derived.by(() => {
    return data.metadata?.issuer;
});

function login() {
    window.location = url;
}

let input: HTMLInputElement | null = null;
let homeserver: string | undefined = $state(undefined);

let metadata: any | undefined = $state(undefined);

let busy = $state(false);

let bad_homeserver = $state(false);

async function start() {
    if(!homeserver) {
        input?.focus();
        return;
    }
    console.log("Starting login process");
    busy = true;

    try {
        const response = await getAuthMetadata(homeserver)
        if(response) {
            console.log("OIDC metadata fetched.", response)
            metadata = response;
        }
    } catch (error) {
        console.error(error)
        bad_homeserver = true;
        focusInput();
    }

    busy = false;
}


function handleEnter(event: KeyboardEvent) {
    if(!homeserver) return;
    if (event.key === "Enter") {
        event.preventDefault();
        start();
    }
}

</script>

<div class="w-screen h-screen grid place-items-center">
    <div class="flex flex-col mb-20 w-sm">
        <div class="">
            Authenticate with your homeserver.
        </div>
        <div class="mt-5">
            <input type="text" class="p-3 w-full"
                bind:this={input}
                bind:value={homeserver} 
                onkeydown={handleEnter}
                placeholder="https://matrix.commune.sh" 
                disabled={busy}
            />
        </div>
        <div class="grid mt-4">
            <button onclick={start} class="py-4 font-medium" 
            disabled={busy}>
                {busy ? "Logging in..." : "Login"}
                {#if busy}
                    <span class="ml-2 spinner-border" role="status" aria-hidden="true"></span>
                {/if}
            </button>
        </div>
        <div class="grid mt-4 text-sm text-red-600">
            {#if bad_homeserver}
                Could not fetch OIDC metadata from the homeserver. Please check the URL and try again.
            {/if}
        </div>
    </div>
</div>
