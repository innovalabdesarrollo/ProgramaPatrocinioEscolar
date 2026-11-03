<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api.js';

	let requests = $state([]);
	let waitlist = $state([]);
	let institutions = $state([]);
	let statuses = $state([]);
	let rules = $state(null);
	let error = $state('');
	let tab = $state('solicitudes');
	let waitSort = $state('priority');
	let recalculating = $state(false);
	let form = $state({
		institutionId: '',
		solicitanteNombre: '',
		solicitanteEmail: '',
		solicitanteTelefono: '',
		cantidadEstimada: 30,
		modalidadPreferida: 'patrocinada',
		notas: ''
	});

	async function load() {
		error = '';
		try {
			[requests, waitlist, institutions, statuses, rules] = await Promise.all([
				api('/api/requests'),
				api(`/api/waitlist?sort=${waitSort}`),
				api('/api/institutions'),
				api('/api/requests/meta/statuses'),
				api('/api/waitlist/rules')
			]);
		} catch (err) {
			error = err.message;
		}
	}

	async function loadWaitlist() {
		try {
			waitlist = await api(`/api/waitlist?sort=${waitSort}`);
		} catch (err) {
			error = err.message;
		}
	}

	async function create(e) {
		e.preventDefault();
		const inst = institutions.find((i) => i.id === form.institutionId);
		try {
			await api('/api/requests', {
				method: 'POST',
				body: { ...form, institutionNombre: inst?.nombre || '' }
			});
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	async function setStatus(id, status) {
		try {
			const body = { status };
			if (status === 'pendiente_contacto') {
				const msg = prompt(
					'¿Qué información debe complementar la institución?',
					'Confirmar cantidad de asistentes, teléfono y fecha preferida'
				);
				if (msg == null) return;
				body.infoRequested = msg.trim();
			}
			await api(`/api/requests/${id}`, { method: 'PATCH', body });
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	async function askInfo(r) {
		const msg = prompt(
			'Mensaje para la institución (aparecerá en /consulta)',
			r.infoRequested || 'Favor de complementar los datos faltantes de la solicitud'
		);
		if (msg == null || !msg.trim()) return;
		try {
			await api(`/api/requests/${r.id}`, {
				method: 'PATCH',
				body: { status: 'pendiente_contacto', infoRequested: msg.trim() }
			});
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	async function setPriority(id, priority) {
		try {
			await api(`/api/waitlist/${id}`, { method: 'PATCH', body: { priority: Number(priority) } });
			await loadWaitlist();
		} catch (err) {
			error = err.message;
		}
	}

	async function applySuggested(w) {
		await setPriority(w.id, w.suggestedPriority);
	}

	async function recalculate() {
		recalculating = true;
		error = '';
		try {
			const res = await api('/api/waitlist/recalculate', { method: 'POST', body: { force: true } });
			waitlist = res.items || [];
			waitSort = 'priority';
		} catch (err) {
			error = err.message;
		} finally {
			recalculating = false;
		}
	}

	onMount(load);
</script>

<div class="mb-4">
	<h1 class="text-xl font-semibold text-[var(--brand)]">Solicitudes y lista de espera</h1>
	<p class="text-sm text-slate-600">Seguimiento del proceso de atención</p>
</div>

{#if error}<p class="mb-2 text-sm text-red-600">{error}</p>{/if}

<div class="mb-3 flex gap-2">
	<button class={tab === 'solicitudes' ? 'btn' : 'btn-secondary'} onclick={() => (tab = 'solicitudes')}>Solicitudes</button>
	<button class={tab === 'espera' ? 'btn' : 'btn-secondary'} onclick={() => (tab = 'espera')}>Lista de espera</button>
</div>

{#if tab === 'solicitudes'}
	<form class="card mb-4 grid gap-3 sm:grid-cols-2" onsubmit={create}>
		<label class="sm:col-span-2">
			<span class="label">Institución</span>
			<select class="input" bind:value={form.institutionId} required>
				<option value="">Seleccionar…</option>
				{#each institutions as i}
					<option value={i.id}>{i.nombre}</option>
				{/each}
			</select>
		</label>
		<label>
			<span class="label">Solicitante</span>
			<input class="input" bind:value={form.solicitanteNombre} required />
		</label>
		<label>
			<span class="label">Email</span>
			<input class="input" type="email" bind:value={form.solicitanteEmail} />
		</label>
		<label>
			<span class="label">Cantidad estimada</span>
			<input class="input" type="number" bind:value={form.cantidadEstimada} />
		</label>
		<label>
			<span class="label">Modalidad preferida</span>
			<select class="input" bind:value={form.modalidadPreferida}>
				<option value="patrocinada">Patrocinada</option>
				<option value="pagada">Pagada</option>
			</select>
		</label>
		<button class="btn sm:col-span-2">Registrar solicitud</button>
	</form>

	<div class="card overflow-x-auto">
		<table class="w-full min-w-[640px] text-left text-sm">
			<thead class="text-xs uppercase text-slate-500">
				<tr>
					<th class="py-2">Institución</th>
					<th>Solicitante</th>
					<th>Estado</th>
					<th>Acción</th>
				</tr>
			</thead>
			<tbody>
				{#each requests as r}
					<tr class="border-t border-slate-100">
						<td class="py-2">
							{r.institutionNombre}
							{#if r.infoRequested}
								<p class="mt-0.5 text-xs text-amber-700">Info pedida: {r.infoRequested}</p>
							{/if}
						</td>
						<td>
							{r.solicitanteNombre}
							{#if r.solicitanteEmail}
								<span class="block text-xs text-slate-400">{r.solicitanteEmail}</span>
							{/if}
						</td>
						<td><span class="rounded bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span></td>
						<td class="space-y-1">
							<select
								class="input max-w-[180px]"
								value={r.status}
								onchange={(e) => setStatus(r.id, e.currentTarget.value)}
							>
								{#each statuses as s}
									<option value={s}>{s}</option>
								{/each}
							</select>
							<button type="button" class="btn-secondary text-xs" onclick={() => askInfo(r)}>
								Pedir info
							</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	{#if rules}
		<p class="mb-2 text-xs text-slate-500">
			Regla: ≥30d → prio 1 · ≥14d → 2 · ≥7d → 3 · resto → 4 (menor = más urgente)
		</p>
	{/if}
	<div class="mb-3 flex flex-wrap gap-2">
		<select
			class="input w-auto"
			bind:value={waitSort}
			onchange={loadWaitlist}
		>
			<option value="priority">Orden: prioridad + días</option>
			<option value="wait">Orden: más días esperando</option>
			<option value="suggested">Orden: prioridad sugerida</option>
		</select>
		<button class="btn-secondary" disabled={recalculating} onclick={recalculate}>
			{recalculating ? 'Aplicando…' : 'Aplicar reglas a todos'}
		</button>
	</div>

	<div class="card overflow-x-auto">
		<table class="w-full min-w-[640px] text-left text-sm">
			<thead class="text-xs uppercase text-slate-500">
				<tr>
					<th class="py-2">#</th>
					<th>Institución</th>
					<th>Días espera</th>
					<th>Prioridad</th>
					<th>Sugerida</th>
					<th>Estado</th>
				</tr>
			</thead>
			<tbody>
				{#each waitlist as w, idx}
					<tr class="border-t border-slate-100 {w.priorityOutdated ? 'bg-amber-50/60' : ''}">
						<td class="py-2 text-slate-400">{idx + 1}</td>
						<td>
							<div class="font-medium">{w.institutionNombre}</div>
							<div class="text-xs text-slate-500">{w.zona} · {w.nivelEducativo}</div>
						</td>
						<td>
							<span class="font-medium">{w.daysWaiting}</span>
							<span class="text-xs text-slate-400">
								· desde {new Date(w.requestDate).toLocaleDateString('es-MX')}
							</span>
						</td>
						<td>
							<input
								class="input max-w-[72px]"
								type="number"
								min="1"
								max="9"
								value={w.priority}
								onchange={(e) => setPriority(w.id, e.currentTarget.value)}
							/>
						</td>
						<td>
							<span class="mr-1">{w.suggestedPriority}</span>
							{#if w.priorityOutdated}
								<button
									type="button"
									class="btn-secondary text-xs"
									onclick={() => applySuggested(w)}
								>
									Usar
								</button>
							{/if}
						</td>
						<td>{w.status}</td>
					</tr>
				{:else}
					<tr><td class="py-3 text-slate-400" colspan="6">Sin registros activos en espera</td></tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
