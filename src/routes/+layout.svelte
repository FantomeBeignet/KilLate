<script>
	import '../app.css';
	import { lateStore } from '../store';
	import { trpc } from '$lib/trpc/client';
	import { onMount } from 'svelte';

	const loadDelays = async () => {
		const data = await trpc().delays.get.query();
		lateStore.set(data.sort().reverse());
	};

	onMount(() => {
		loadDelays();
	});
</script>

<div class="p-6 text-3xl font-semibold text-primary-400"><a href="/">KilLate</a></div>
<slot />
