import { PUBLIC_BASE_URL } from '$env/static/public';

import type { PageServerLoad } from './$types';
import { redirect } from "@sveltejs/kit";
import { generateDeviceId, generatePKCEParams } from '$lib/utils/oidc'

export const load: PageServerLoad = async ({ cookies, parent }) => {
    let oidc_client_id = cookies.get('oidc_client_id');
    return {
        oidc_client_id
    }

    /*
    let data = await parent();

    let redirect_url = `${PUBLIC_BASE_URL}/oidc/callback`;

    const oidc_client_id = data.oidc_client_id

    const authorization_endpoint = data.metadata?.authorization_endpoint;

    let device_id = await generateDeviceId();

    let scope = `urn:matrix:org.matrix.msc2967.client:api:* urn:matrix:org.matrix.msc2967.client:device:${device_id} urn:synapse:admin:* urn:mas:admin`;

    let pkce = await generatePKCEParams();

    cookies.set('oidc_code_verifier', pkce.code_verifier, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
        secure: true,
        path: '/'
    });


    let url = `${authorization_endpoint}?client_id=${oidc_client_id}&redirect_uri=${redirect_url}&response_type=code&response_mode=query&scope=${scope}&state=${pkce.state}&code_challenge=${pkce.code_challenge}&code_challenge_method=S256`;

    url = encodeURI(url);

    console.log('Redirecting to:', url);

    //redirect(302, url);

    return {
        data,
        url
    }
    */
};

