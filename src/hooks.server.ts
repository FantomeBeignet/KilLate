import { SvelteKitAuth } from '@auth/sveltekit';
import GoogleProvider from '@auth/core/providers/google';
import {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	AUTH_SECRET,
	USER_WHITELIST
} from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const authorize = (async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/killian')) {
		const session = await event.locals.getSession();
		if (!session) {
			throw redirect(303, '/auth/signin');
		}
	}
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => html
	});
	return result;
}) satisfies Handle;

export const handle: Handle = sequence(
	SvelteKitAuth({
		// @ts-ignore
		providers: [GoogleProvider({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET })],
		secret: AUTH_SECRET,
		callbacks: {
			async signIn({ user }) {
				if (!user.email) return false;
				return USER_WHITELIST.split(';').includes(user.email);
			}
		}
	}),
	authorize
);
