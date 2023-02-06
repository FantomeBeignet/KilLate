<script lang="ts">
	const now = new Date();
	now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
	let timeString = now.toISOString().slice(0, 16);
</script>

<main class="my-auto flex flex-col items-center justify-center gap-24 p-12">
	<h1 class="text-center text-4xl font-semibold md:text-6xl md:font-bold">La gérance</h1>
	<form method="POST" class="flex flex-col items-center justify-center gap-6 md:flex-row">
		<input
			name="time"
			type="datetime-local"
			class="rounded-md border-2 border-primary-400 bg-neutral-900 p-4"
			bind:value={timeString}
		/>
		<input
			type="submit"
			class="rounded-md border-2 border-primary-400 bg-neutral-900 p-4"
			value="Valider"
		/>
	</form>
</main>
