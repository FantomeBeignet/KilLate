import redis from '$lib/redis';
import { t } from '$lib/trpc/t';
import { z } from 'zod';
import pusher from '$lib/pusher/server';

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
