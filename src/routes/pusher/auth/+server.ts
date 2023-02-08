import type { RequestHandler } from './$types';
import pusher from '$lib/pusher/server';
import { error, json } from '@sveltejs/kit';
import { Response } from 'pusher';

export const POST = (async ({ request }) => {
	const body = await request.formData();
	console.log(body);
	const socketId = body.get('socket_id') as string;
	const channelName = body.get('channel_name') as string;
	if (socketId == null) throw error(403);
	const resp = pusher.authorizeChannel(socketId, channelName);
	return json(resp);
}) satisfies RequestHandler;
