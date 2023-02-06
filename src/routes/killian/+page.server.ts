import type { Actions } from './$types';
import redis from '$lib/redis';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const time = data.values().next().value;
        redis.lpush('delays', time)
	}
} satisfies Actions;
