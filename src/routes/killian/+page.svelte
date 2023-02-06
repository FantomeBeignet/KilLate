<script lang="ts">
	import { lateStore } from '../../store';
	import { trpc } from '$lib/trpc/client';

	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	let timeString = now.toISOString().slice(0, 16);

	const addDelay = async () => {
		lateStore.update((store) => {
			store.push(timeString);
			return store;
		});
		await trpc().delays.add.mutate(timeString);
	};

	const remDelay = async (time: string) => {
		lateStore.update((store) => {
			store.splice(store.indexOf(time), 1);
			return store;
		});
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
</script>

<main class="flex flex-col items-center justify-center gap-20 p-12">
	<h1 class="text-center text-4xl font-semibold md:text-6xl md:font-bold">La gérance</h1>
	<div class="flex flex-col items-center justify-center gap-6 md:flex-row">
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
			class="rounded-md border-2 border-primary-400 bg-neutral-900 p-4">Valider</button
		>
	</div>
	{#if $lateStore.length > 0}
		<div class="w-full divide-y-2 divide-neutral-600 rounded-md border-2 border-primary-400">
			{#each $lateStore as delay}
				<div class="flex items-center justify-between gap-6 p-4">
					<span>{delayToString(delay)}</span>
					<button
						on:click={() => {
							remDelay(delay);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-6 w-6"
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
	{:else}
		<div class="flex flex-col items-center justify-center text-center text-2xl text-neutral-600">
			<span>Killian n'a aucun retard pour le moment...</span><span>Étrange...</span>
		</div>
	{/if}
</main>
