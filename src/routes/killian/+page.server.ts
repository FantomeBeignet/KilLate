import type { Actions, PageServerLoad } from './$types';
import redis from '$lib/redis';

export const actions = {
	add: async ({ request }) => {
		const data = await request.formData();
		const time = data.values().next().value;
		redis.lpush('delays', time);
	},
	rem: async ({ request }) => {
		const data = await request.formData();
		const time = data.values().next().value;
		redis.lrem('delays', 1, time);
	}
} satisfies Actions;

export const load = (async () => {
	const delays = await redis.lrange('delays', 0, -1);
	return {
		delays: delays
	};
}) satisfies PageServerLoad;
