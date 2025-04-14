<script>
let sections = [
    {
        title: "Users",
        links: [
            {
                title: "List Users",
                href: "/users"
            },
            {
                title: "Add User",
                href: "/users/add"
            }
        ]
    },
    {
        title: "Rooms",
        links: [
            {
                title: "List Rooms",
                href: "/rooms"
            },
            {
                title: "Add Room",
                href: "/rooms/add"
            }
        ]
    }
]
</script>

<div class="sidebar grid grid-rows-[auto_1fr_auto] w-60 bg-col-950 text-white">

    <div class="p-4 flex gap-2 mb-4">
        <div class="flex-1">
            <h2 class="text font-semibold text-col-300">Admin</h2>
        </div>
        <div class="">
        </div>
    </div>

    <div class="mt-2 text-sm text-col-400">

    {#each sections as section}
        <div class="mb-8">
            <div class="mb-2 px-4 mono uppercase tracking-widest text-xs font-medium">
                {section.title}
            </div>
            <ul>
                {#each section.links as link}
                    <a href={link.href}>
                    <li class="px-4 py-[2px] font-medium hover:text-white hover:bg-col-800 cursor-pointer">
                        {link.title}
                    </li>
                    </a>
                {/each}
            </ul>
        </div>
    {/each}

    </div>

</div>

<style lang="postcss">
@reference "tailwindcss/theme";
</style>
