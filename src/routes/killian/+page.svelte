<script lang="ts">
	import { onMount } from 'svelte';
	import { lateStore } from '../../store';
	import { trpc } from '$lib/trpc/client';
	import pusher from '$lib/pusher/client';

	let channel: Channel;
	onMount(() => {
		channel = pusher.subscribe('private-delays');
	});
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	let timeString = now.toISOString().slice(0, 16);

	const addDelay = async () => {
		lateStore.update((store) => {
			store.push(timeString);
			return store.sort().reverse();
		});
		channel.trigger('client-add', timeString);
		await trpc().delays.add.mutate(timeString);
	};

	const remDelay = async (time: string) => {
		lateStore.update((delays) => delays.filter((delay) => delay !== time));
		channel.trigger('client-rem', timeString);
		await trpc().delays.rem.mutate(time);
	};

	function delayToString(delay: string) {
		const delayDate = new Date(Date.parse(delay));
		return (
			delayDate.toLocaleDateString('fr-FR') +
			' - ' +
			delayDate.toLocaleTimeString('fr-FR').slice(0, 5)
		);
	}

	import { moneyStore } from '../../store';
	import { z } from 'zod';
	import type { Channel } from 'pusher-js';

	const loadMoney = async () => {
		const data = await trpc().money.get.query();
		moneyStore.set(data);
	};

	onMount(() => {
		loadMoney();
	});

	let money = 0;
	const moneySchema = z
		.number({ invalid_type_error: 'La somme doit être un nombre' })
		.int('La somme doit être un nombre entier')
		.nonnegative('La somme doit être positive');

	let parsedResult = moneySchema.safeParse(money);
	$: if (parsedResult.success) {
		money = parsedResult.data;
	}
	let missing = $lateStore.length - $moneyStore;

	const addMoney = async () => {
		moneyStore.update((store) => {
			store += money;
			return store;
		});
		await trpc().money.add.mutate(money);
	};
</script>

<main class="flex flex-col items-center justify-center gap-16 p-12">
	<div class="flex flex-col items-center justify-center gap-4 md:gap-8">
		<span class="text-4xl font-semibold md:text-6xl md:font-bold">L'argent</span>
		<div class="flex flex-col items-center justify-center md:gap-2">
			<span class="text-2xl font-semibold md:text-4xl">Déposé : {$moneyStore}€</span>
			<span class="text-2xl font-semibold md:text-4xl">Manquant : {missing}€</span>
		</div>
		<div class="flex items-center justify-center gap-4">
			<input
				type="number"
				class="w-2/6 rounded-md border-2 border-primary-400 bg-neutral-900 p-4 md:text-xl"
				placeholder="0"
				bind:value={money}
			/>
			<button
				on:click={() => {
					addMoney();
				}}
				class="rounded-md border-2 border-primary-400 bg-neutral-900 p-4 transition-colors hover:text-primary-400 md:text-xl"
				>Ajouter</button
			>
		</div>
	</div>
	<div class="flex flex-col items-center justify-center gap-6 md:gap-8">
		<h1 class="text-center text-4xl font-semibold md:text-6xl md:font-bold">Les retards</h1>
		<div class="flex flex-col items-center justify-center gap-4 md:flex-row md:text-xl">
			<input
				name="time"
				type="datetime-local"
				class="rounded-md border-2 border-primary-400 bg-neutral-900 p-4"
				bind:value={timeString}
			/>
			<button
				on:click={() => {
					addDelay();
				}}
				class="rounded-md border-2 border-primary-400 bg-neutral-900 p-4 transition-colors hover:text-primary-400"
				>Valider</button
			>
		</div>
		{#if $lateStore.length > 0}
			<div class="flex flex-col items-center justify-center gap-4">
				<span class="text-2xl font-semibold md:text-4xl">Liste des retards</span>
				<div
					class="w-full max-w-lg divide-y-2 divide-neutral-600 rounded-md border-2 border-primary-400 md:text-xl"
				>
					{#each $lateStore as delay}
						<div class="flex items-center justify-between gap-6 p-4">
							<span>{delayToString(delay)}</span>
							<button
								on:click={() => {
									remDelay(delay);
								}}
								class="flex items-center justify-center"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-6 w-6 transition-colors hover:text-primary-400 md:h-8 md:w-8"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
									/>
								</svg>
							</button>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			<div
				class="flex flex-col items-center justify-center text-center text-2xl text-neutral-600 md:text-4xl"
			>
				<span>Killian n'a aucun retard pour le moment...</span><span>Étrange...</span>
			</div>
		{/if}
	</div>
</main>
