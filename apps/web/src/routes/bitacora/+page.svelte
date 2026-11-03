<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api.js';

	let rows = $state([]);
	let error = $state('');
	let entity = $state('');
	let userEmail = $state('');

	async function load() {
		error = '';
		try {
			const q = new URLSearchParams();
			if (entity) q.set('entity', entity);
			if (userEmail.trim()) q.set('userEmail', userEmail.trim());
			rows = await api(`/api/audit?${q}`);
		} catch (err) {
			error = err.message;
			rows = [];
		}
	}

	onMount(load);

	function fmt(at) {
		if (!at) return '—';
		try {
			return new Date(at).toLocaleString('es-MX', { timeZone: 'America/Ciudad_Juarez' });
		} catch {
			return String(at);
		}
	}
</script>

<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
	<div>
		<h1 class="text-xl font-semibold text-[var(--brand)]">Bitácora</h1>
		<p class="text-sm text-slate-600">Auditoría de acciones (admin, sistemas, directivo)</p>
	</div>
	<div class="flex flex-wrap gap-2">
		<input class="input w-auto" placeholder="Entidad (visit, institution…)" bind:value={entity} />
		<input class="input w-auto" placeholder="Email usuario" bind:value={userEmail} />
		<button class="btn" onclick={load}>Filtrar</button>
	</div>
</div>

{#if error}
	<p class="mb-3 text-sm text-red-600">{error}</p>
{/if}

<div class="card overflow-x-auto">
	<table class="w-full min-w-[640px] text-left text-sm">
		<thead class="text-xs uppercase text-slate-500">
			<tr>
				<th class="py-2">Fecha</th>
				<th>Usuario</th>
				<th>Acción</th>
				<th>Entidad</th>
				<th>Id</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as r}
				<tr class="border-t border-slate-100 align-top">
					<td class="py-2 whitespace-nowrap text-xs">{fmt(r.at)}</td>
					<td class="text-xs">{r.userEmail || r.userId || '—'}</td>
					<td>{r.action}</td>
					<td>{r.entity}</td>
					<td class="font-mono text-xs text-slate-500">{r.entityId || '—'}</td>
				</tr>
			{:else}
				<tr>
					<td class="py-4 text-slate-500" colspan="5">Sin registros o sin permiso.</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
