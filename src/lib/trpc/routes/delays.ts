import redis from '$lib/redis';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import { PUSHER_APP_ID, PUSHER_SECRET } from '$env/static/private';
import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from '$env/static/public';
import Pusher from 'pusher';

const pusher = new Pusher({
	appId: PUSHER_APP_ID,
	key: PUBLIC_PUSHER_KEY,
	secret: PUSHER_SECRET,
	cluster: PUBLIC_PUSHER_CLUSTER,
	useTLS: true
});
export const delays = t.router({
	add: t.procedure.input(z.string()).mutation(async ({ input }) => {
		redis.lpush('delays', input);
		pusher.trigger('delays', 'add', input);
	}),
	rem: t.procedure.input(z.string()).mutation(async ({ input }) => {
		redis.lrem('delays', 1, input);
		pusher.trigger('delays', 'rem', input);
	}),
	num: t.procedure.query(async () => {
		const data = await redis.llen('delays');
		return data;
	}),
	get: t.procedure.query(async () => {
		const data = await redis.lrange('delays', 0, -1);
		return data;
	})
});
