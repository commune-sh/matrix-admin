import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies, parent }) => {
    let oidc_client_id = cookies.get('oidc_client_id');
    return {
        oidc_client_id
    }
};

