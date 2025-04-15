<script lang="ts">
import { getAuthMetadata, registerOauthClient } from '$lib/matrix/requests'
import { generateDeviceId, generatePKCEParams } from '$lib/utils/oidc'

import { onMount, tick } from "svelte";

async function focusInput() {
    await tick();
    if(input) {
        input.focus();
    }
}

let { data } = $props();

let oidc_client_id: string | undefined = $state(undefined);

onMount(() => {
    focusInput();
    if(data?.oidc_client_id) {
        oidc_client_id = data.oidc_client_id;
    }
});


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

let registration_endpoint = $derived.by(() => {
    return metadata?.registration_endpoint;
});

let authorization_endpoint = $derived.by(() => {
    return metadata?.authorization_endpoint;
});

let busy = $state(false);

let bad_homeserver = $state(false);
let registration_failed = $state(false);

async function start() {
    if(!homeserver) {
        input?.focus();
        return;
    }
    console.log("Starting login process");
    busy = true;

    let base_url = window.location.origin;

    try {
        const response = await getAuthMetadata(homeserver)
        if(response) {
            console.log("OIDC metadata fetched.", response)
            metadata = response;
            // Store homeserver
            await fetch('/api/auth/cookie', {
                method: 'POST',
                body: JSON.stringify({
                    homeserver: homeserver,
                }),
            });
        }

    } catch (error) {
        console.error(error)
        bad_homeserver = true;
        focusInput();
    }

    if(!oidc_client_id && registration_endpoint) {
        console.log("Registering OIDC client");
        try {

            const response = await registerOauthClient(registration_endpoint, base_url);
            if(response) {
                console.log("OIDC client registered.", response)
                oidc_client_id = response.client_id;

                const res = await fetch('/api/auth/cookie', {
                    method: 'POST',
                    body: JSON.stringify({
                        oidc_client_id: response.client_id,
                    }),
                });
                const json = await res.json();
                console.log("OIDC client ID stored?", json)

            }
        } catch (error) {
            console.error(error)
            registration_failed = true;
            focusInput();
        }
    }

    if(oidc_client_id && authorization_endpoint) {

        let redirect_url = `${base_url}/oidc/callback`;

        let device_id = await generateDeviceId();

        let scope = `urn:matrix:org.matrix.msc2967.client:api:* urn:matrix:org.matrix.msc2967.client:device:${device_id} urn:synapse:admin:* urn:mas:admin`;

        let pkce = await generatePKCEParams();

        try {
            const res = await fetch('/api/auth/cookie', {
                method: 'POST',
                body: JSON.stringify({
                    oidc_code_verifier: pkce.code_verifier,
                }),
            });
            const json = await res.json();
            console.log("Code verifier stored?", json)
        } catch (error) {
            console.error(error)
            return
        }

        let url = `${authorization_endpoint}?client_id=${oidc_client_id}&redirect_uri=${redirect_url}&response_type=code&response_mode=query&scope=${scope}&state=${pkce.state}&code_challenge=${pkce.code_challenge}&code_challenge_method=S256`;

        url = encodeURI(url);
        window.location = url;
        return
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
            {#if registration_failed}
                Could not register OIDC client with the homeserver. 
            {/if}
        </div>
    </div>
</div>
