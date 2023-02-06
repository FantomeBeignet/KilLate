import redis, { databaseName } from '$lib/redis';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const data = await redis.hgetall(databaseName);
	if (!data) return { lateCounter: 0 };
	return { lateCounter: Object.keys(data).length };
}) satisfies PageServerLoad; 
