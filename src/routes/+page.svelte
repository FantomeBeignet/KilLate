<script lang="ts">
	import { lateStore } from '../store';
	import { page } from '$app/stores';
	import pusher from '$lib/pusher/client';
	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		const channel = pusher.subscribe('private-delays');
		channel.bind('client-add', (data: string) => {
			lateStore.update((delays) => [...delays, data]);
		});
		channel.bind('client-rem', (data: string) => {
			lateStore.update((delays) => delays.filter((delay) => delay !== data));
		});
	});

	onDestroy(() => {
		pusher.unsubscribe('delays');
	});
</script>

<main class="my-auto flex flex-col items-center justify-between gap-36 p-12">
	<div class="flex flex-col items-center justify-center gap-24">
		<h1 class="text-center text-4xl font-semibold md:text-6xl md:font-bold">
			Nombre de retards de Killian :
		</h1>
		<span
			class="relative inline-block p-3 before:absolute before:-inset-1 before:block before:-skew-y-6 before:bg-primary-400 md:p-6 md:before:-skew-y-3"
			><span class="relative text-4xl font-bold md:text-6xl md:font-extrabold"
				>{$lateStore.length}</span
			></span
		>
	</div>

	{#if !$page.data.session}
		<a
			href="/auth/signin"
			class="hover:decoration-400 rounded-md border-2 border-primary-400 p-4 text-xl transition-colors hover:text-primary-400 md:p-6 md:text-2xl"
			>Je suis Killian</a
		>
	{:else}
		<a
			href="/killian"
			class="hover:decoration-400 rounded-md border-2 border-primary-400 p-4 text-xl transition-colors hover:text-primary-400 md:p-6 md:text-2xl"
			>Gérer mes retards</a
		>
	{/if}
</main>
