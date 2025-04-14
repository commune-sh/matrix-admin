<script lang="ts">
import '../../app.css';

import Sidebar from '$lib/sidebar/sidebar.svelte';

let { children } = $props();
</script>

<div class="flex h-screen w-full">

    <Sidebar />

    <div class="flex-1 p-6">
        {@render children()}
    </div>
</div>
