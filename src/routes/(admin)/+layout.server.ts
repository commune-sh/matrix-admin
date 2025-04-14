import { 
    PUBLIC_HOMESERVER
} from '$env/static/public';

import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, params, url, cookies, request } ) => {
    const access_token = cookies.get('access_token');
    const refresh_token = cookies.get('refresh_token');
    const expires_in = cookies.get('expires_in');
    const user_id = cookies.get('user_id');
    const device_id = cookies.get('device_id');

    if(!access_token || !refresh_token) {
        redirect(302, '/login');
    }

    const oidc_client_id = cookies.get('oidc_client_id');

    let data = {};

    if(access_token && refresh_token && user_id && device_id && expires_in) {
        data.session = {
            access_token,
            refresh_token,
            user_id,
            device_id,
            expires_in: parseInt(expires_in)
        }
    }

    if(oidc_client_id) {
        data.oidc_client_id = oidc_client_id
    }

    const auth_url = `${PUBLIC_HOMESERVER}/_matrix/client/unstable/org.matrix.msc2965/auth_metadata`;

    const res = await fetch(auth_url)
	const auth_metadata = await res.json();
    if(auth_metadata) {
        data.auth_metadata = auth_metadata;
    }


    return data;
};


