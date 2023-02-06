import redis, { databaseName } from '$lib/redis';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	const data = await redis.llen('delays');
	if (!data) return { lateCounter: 0 };
	return { lateCounter: data };
}) satisfies PageServerLoad; 
