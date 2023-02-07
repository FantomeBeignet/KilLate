import redis from '$lib/redis';
import { z } from 'zod';
import { t } from '$lib/trpc/t';

export const money = t.router({
	add: t.procedure.input(z.number().int()).mutation(async ({ input }) => {
		const value: number | null = await redis.get('money');
		if (value === null) {
			redis.set('money', input);
		} else {
			redis.set('money', value + input);
		}
	}),
	get: t.procedure.query(async () => {
		const data: number | null = await redis.get('money');
		if (data === null) {
			return 0;
		} else {
			return data;
		}
	})
});
