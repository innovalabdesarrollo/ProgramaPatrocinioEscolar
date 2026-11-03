<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api.js';

	let visits = $state([]);
	let institutions = $state([]);
	let campaigns = $state([]);
	let sponsors = $state([]);
	let availability = $state(null);
	let selectedDay = $state(null);
	let calMonth = $state(monthKey(new Date()));
	let error = $state('');
	let form = $state({
		institutionId: '',
		fecha: '',
		horario: '10:00',
		actividad: 'Recorrido',
		modalidad: 'pagada',
		campaignId: '',
		sponsorId: '',
		asistentesEstimados: 30,
		observaciones: ''
	});

	function monthKey(d) {
		return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
	}

	function monthRange(ym) {
		const [y, m] = ym.split('-').map(Number);
		const from = `${y}-${String(m).padStart(2, '0')}-01`;
		const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
		const to = `${y}-${String(m).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
		return { from, to };
	}

	async function loadAvailability() {
		const { from, to } = monthRange(calMonth);
		availability = await api(`/api/visits/availability?from=${from}&to=${to}`);
	}

	async function load() {
		error = '';
		try {
			[visits, institutions, campaigns, sponsors] = await Promise.all([
				api('/api/visits'),
				api('/api/institutions'),
				api('/api/sponsorship/campaigns'),
				api('/api/sponsorship/sponsors')
			]);
			await loadAvailability();
		} catch (err) {
			error = err.message;
		}
	}

	function shiftMonth(delta) {
		const [y, m] = calMonth.split('-').map(Number);
		const d = new Date(Date.UTC(y, m - 1 + delta, 1));
		calMonth = monthKey(d);
		selectedDay = null;
		loadAvailability().catch((err) => (error = err.message));
	}

	function pickDay(day) {
		selectedDay = day;
		if (!day.full) form.fecha = day.date;
	}

	function dayClass(day) {
		if (day.full) return 'bg-red-100 text-red-800 border-red-200';
		if (day.active > 0) return 'bg-amber-50 text-amber-900 border-amber-200';
		return 'bg-emerald-50 text-emerald-900 border-emerald-100';
	}

	async function create(e) {
		e.preventDefault();
		try {
			await api('/api/visits', {
				method: 'POST',
				body: {
					...form,
					campaignId: form.campaignId || null,
					sponsorId: form.sponsorId || null
				}
			});
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	async function patch(id, body) {
		try {
			const res = await api(`/api/visits/${id}`, { method: 'PATCH', body });
			if (res?.linkedSupport) {
				error = '';
				alert(
					`Visita cerrada. Se registró apoyo automático (${res.linkedSupport.tipoBeneficio}) para la institución.`
				);
			}
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	async function reschedule(v) {
		const current = new Date(v.fecha).toISOString().slice(0, 10);
		const fecha = prompt('Nueva fecha (YYYY-MM-DD)', current);
		if (fecha == null || !fecha.trim()) return;
		const horario = prompt('Nuevo horario', v.horario || '10:00');
		if (horario == null) return;
		const motivo = prompt('Motivo de reprogramación (opcional)', '') ?? '';
		try {
			await api(`/api/visits/${v.id}/reschedule`, {
				method: 'POST',
				body: { fecha: fecha.trim(), horario: horario.trim(), motivo: motivo.trim() }
			});
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	function nameOf(id) {
		return institutions.find((i) => i.id === id)?.nombre || id;
	}

	function canReschedule(v) {
		return v.status === 'programada' || v.status === 'confirmada';
	}

	/** Días vacíos al inicio del grid (lunes=0) para alinear el calendario. */
	let calendarPad = $derived.by(() => {
		const first = availability?.days?.[0];
		if (!first?.date) return 0;
		return (new Date(first.date + 'T12:00:00Z').getUTCDay() + 6) % 7;
	});

	onMount(load);
</script>

<div class="mb-4">
	<h1 class="text-xl font-semibold text-[var(--brand)]">Reservaciones y visitas</h1>
	<p class="text-sm text-slate-600">Programar, confirmar, registrar resultados · pagadas / patrocinadas</p>
</div>

{#if error}<p class="mb-2 text-sm text-red-600">{error}</p>{/if}

{#if availability}
	<div class="card mb-4">
		<div class="mb-3 flex flex-wrap items-center justify-between gap-2">
			<div>
				<h2 class="font-medium text-[var(--brand)]">Disponibilidad del mes</h2>
				<p class="text-xs text-slate-500">
					Cupo diario: {availability.cap} visitas activas (programada/confirmada) · configurable con
					<code>VISITS_DAILY_CAP</code>
				</p>
			</div>
			<div class="flex gap-2">
				<button type="button" class="btn-secondary text-sm" onclick={() => shiftMonth(-1)}>←</button>
				<span class="self-center text-sm font-medium">{calMonth}</span>
				<button type="button" class="btn-secondary text-sm" onclick={() => shiftMonth(1)}>→</button>
			</div>
		</div>
		<div class="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-400 sm:text-xs">
			{#each ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as w}
				<div>{w}</div>
			{/each}
		</div>
		<div class="mt-1 grid grid-cols-7 gap-1">
			{#each Array(calendarPad) as _}
				<div></div>
			{/each}
			{#each availability.days as day}
				<button
					type="button"
					class="rounded border px-1 py-1.5 text-left {dayClass(day)} {selectedDay?.date === day.date
						? 'ring-2 ring-[var(--brand)]'
						: ''}"
					onclick={() => pickDay(day)}
					title="{day.active}/{day.cap} activas · {day.remaining} libres"
				>
					<div class="text-xs font-semibold">{Number(day.date.slice(8))}</div>
					<div class="text-[10px] leading-tight">{day.active}/{day.cap}</div>
				</button>
			{/each}
		</div>
		{#if selectedDay}
			<p class="mt-3 text-sm text-slate-600">
				{selectedDay.date}: {selectedDay.active} activas · {selectedDay.remaining} libres
				{#if selectedDay.full}<span class="font-medium text-red-700"> · CUPÓ LLENO</span>{/if}
			</p>
			{#if selectedDay.visits?.length}
				<ul class="mt-1 space-y-1 text-xs text-slate-500">
					{#each selectedDay.visits as v}
						<li>{v.horario || '—'} · {v.status} · {nameOf(v.institutionId)} · {v.actividad}</li>
					{/each}
				</ul>
			{/if}
		{/if}
		<p class="mt-2 text-[11px] text-slate-400">Verde libre · ámbar con visitas · rojo cupo lleno. Clic elige fecha del formulario.</p>
	</div>
{/if}

<form class="card mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" onsubmit={create}>
	<label>
		<span class="label">Institución</span>
		<select class="input" bind:value={form.institutionId} required>
			<option value="">Seleccionar…</option>
			{#each institutions as i}<option value={i.id}>{i.nombre}</option>{/each}
		</select>
	</label>
	<label>
		<span class="label">Fecha</span>
		<input class="input" type="date" bind:value={form.fecha} required />
	</label>
	<label>
		<span class="label">Horario</span>
		<input class="input" bind:value={form.horario} />
	</label>
	<label>
		<span class="label">Actividad</span>
		<input class="input" bind:value={form.actividad} />
	</label>
	<label>
		<span class="label">Modalidad</span>
		<select class="input" bind:value={form.modalidad}>
			<option value="pagada">Pagada</option>
			<option value="patrocinada">Patrocinada</option>
		</select>
	</label>
	<label>
		<span class="label">Asistentes estimados</span>
		<input class="input" type="number" bind:value={form.asistentesEstimados} />
	</label>
	{#if form.modalidad === 'patrocinada'}
		<label>
			<span class="label">Campaña</span>
			<select class="input" bind:value={form.campaignId}>
				<option value="">—</option>
				{#each campaigns as c}<option value={c.id}>{c.nombre}</option>{/each}
			</select>
		</label>
		<label>
			<span class="label">Patrocinador</span>
			<select class="input" bind:value={form.sponsorId}>
				<option value="">—</option>
				{#each sponsors as s}<option value={s.id}>{s.nombre}</option>{/each}
			</select>
		</label>
	{/if}
	<button class="btn sm:col-span-2 lg:col-span-3">Programar visita</button>
</form>

<div class="card overflow-x-auto">
	<table class="w-full min-w-[720px] text-left text-sm">
		<thead class="text-xs uppercase text-slate-500">
			<tr>
				<th class="py-2">Fecha</th>
				<th>Institución</th>
				<th>Modalidad</th>
				<th>Estado</th>
				<th>Asistentes</th>
				<th>Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#each visits as v}
				<tr class="border-t border-slate-100">
					<td class="py-2">
						{new Date(v.fecha).toLocaleDateString('es-MX')} {v.horario}
						{#if v.scheduleHistory?.length}
							<details class="mt-1 text-xs text-slate-500">
								<summary class="cursor-pointer">
									{v.scheduleHistory.length} reprogramación{v.scheduleHistory.length === 1 ? '' : 'es'}
								</summary>
								<ul class="mt-1 space-y-0.5">
									{#each [...v.scheduleHistory].reverse() as h}
										<li>
											antes: {new Date(h.fecha).toLocaleDateString('es-MX')} {h.horario || ''}
											({h.status})
											{#if h.motivo}· {h.motivo}{/if}
											· {new Date(h.at).toLocaleString('es-MX')}
										</li>
									{/each}
								</ul>
							</details>
						{/if}
					</td>
					<td>{nameOf(v.institutionId)}</td>
					<td>
						{v.modalidad}
						{#if v.supportId}
							<span class="mt-0.5 block text-[10px] text-emerald-700">apoyo ligado</span>
						{/if}
					</td>
					<td>{v.status}</td>
					<td>
						{v.asistentesReales ?? '—'} / {v.asistentesEstimados}
					</td>
					<td class="space-x-1">
						{#if v.status === 'programada'}
							<button class="btn-secondary text-xs" onclick={() => patch(v.id, { status: 'confirmada' })}>Confirmar</button>
						{/if}
						{#if canReschedule(v)}
							<button class="btn-secondary text-xs" onclick={() => reschedule(v)}>Reprogramar</button>
							<button
								class="btn-secondary text-xs"
								onclick={() => {
									const n = prompt('Asistentes reales', String(v.asistentesEstimados));
									if (n != null) patch(v.id, { status: 'realizada', asistentesReales: Number(n) });
								}}>Realizada</button
							>
							<button class="btn-secondary text-xs" onclick={() => patch(v.id, { status: 'cancelada' })}>Cancelar</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
