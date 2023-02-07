import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { delays } from '$lib/trpc/routes/delays';
import { money } from '$lib/trpc/routes/money';

export const router = t.router({
	delays,
	money
});

export const caller = router.createCaller({});

export type Router = typeof router;

export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
