<script>
import { PUBLIC_HOMESERVER } from "$env/static/public";
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

</script>

<div class="w-screen h-screen grid place-items-center">
    <div class="">
        <button onclick={login} class="p-8 text-sm font-medium">
            Authenticate with {issuer}
        </button>
    </div>
</div>
