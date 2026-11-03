<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api.js';

	let list = $state([]);
	let search = $state('');
	let status = $state('');
	let pendingOnly = $state(false);
	let error = $state('');
	let selected = $state(null);
	let detail = $state(null);
	let showForm = $state(false);
	let reviewNotes = $state('');
	let reviewing = $state(false);
	let obsForm = $state({ tipo: 'control', text: '' });
	let savingObs = $state(false);
	let form = $state(emptyForm());

	function emptyForm() {
		return {
			nombre: '',
			tipo: 'escuela',
			nivelEducativo: 'primaria',
			turno: 'matutino',
			direccion: '',
			ciudad: 'Ciudad Juárez',
			estado: 'Chihuahua',
			codigoPostal: '',
			zona: '',
			contactoNombre: '',
			contactoEmail: '',
			contactoTelefono: '',
			latitud: '',
			longitud: '',
			statusAtencion: 'no_atendida',
			notas: ''
		};
	}

	async function load() {
		error = '';
		try {
			const q = new URLSearchParams();
			if (search) q.set('search', search);
			if (pendingOnly) q.set('pendingReview', '1');
			else if (status) q.set('status', status);
			list = await api(`/api/institutions?${q}`);
		} catch (err) {
			error = err.message;
		}
	}

	async function openDetail(id) {
		detail = await api(`/api/institutions/${id}`);
		selected = id;
		reviewNotes = '';
		obsForm = { tipo: 'control', text: '' };
	}

	async function addObservation(e) {
		e.preventDefault();
		if (!detail?.institution?.id || !obsForm.text.trim()) return;
		savingObs = true;
		error = '';
		try {
			await api(`/api/institutions/${detail.institution.id}/observations`, {
				method: 'POST',
				body: { tipo: obsForm.tipo, text: obsForm.text.trim() }
			});
			obsForm = { tipo: 'control', text: '' };
			await openDetail(detail.institution.id);
		} catch (err) {
			error = err.message;
		} finally {
			savingObs = false;
		}
	}

	function needsReview(inst) {
		return (
			inst &&
			!inst.discarded &&
			(inst.statusAtencion === 'pendiente_revision' || inst.validated === false)
		);
	}

	async function review(action) {
		if (!detail?.institution?.id) return;
		reviewing = true;
		error = '';
		try {
			await api(`/api/institutions/${detail.institution.id}/review`, {
				method: 'POST',
				body: { action, notes: reviewNotes }
			});
			await load();
			await openDetail(detail.institution.id);
		} catch (err) {
			error = err.message;
		} finally {
			reviewing = false;
		}
	}

	async function save(e) {
		e.preventDefault();
		try {
			const body = {
				...form,
				latitud: form.latitud === '' ? null : Number(form.latitud),
				longitud: form.longitud === '' ? null : Number(form.longitud)
			};
			await api('/api/institutions', { method: 'POST', body });
			showForm = false;
			form = emptyForm();
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	function fmtVal(v) {
		if (v == null || v === '') return '—';
		if (typeof v === 'boolean') return v ? 'sí' : 'no';
		return String(v);
	}

	function timelineDot(type) {
		switch (type) {
			case 'visit':
			case 'visit_reschedule':
				return 'bg-teal-600';
			case 'request':
				return 'bg-blue-600';
			case 'support':
				return 'bg-emerald-600';
			case 'observation':
				return 'bg-amber-500';
			case 'communication':
				return 'bg-violet-500';
			default:
				return 'bg-slate-400';
		}
	}

	onMount(load);
</script>

<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-xl font-semibold text-[var(--brand)]">Catálogo de instituciones</h1>
		<p class="text-sm text-slate-600">Escuelas, asociaciones e instituciones vinculadas</p>
	</div>
	<button class="btn" onclick={() => (showForm = !showForm)}>{showForm ? 'Cerrar' : 'Nueva'}</button>
</div>

<div class="mb-3 flex flex-wrap items-center gap-2">
	<input class="input max-w-xs" placeholder="Buscar…" bind:value={search} onkeydown={(e) => e.key === 'Enter' && load()} />
	<select class="input max-w-[200px]" bind:value={status} disabled={pendingOnly} onchange={load}>
		<option value="">Todos los estatus</option>
		<option value="no_atendida">No atendida</option>
		<option value="en_espera">En espera</option>
		<option value="programada">Programada</option>
		<option value="beneficiada_pagada">Beneficiada pagada</option>
		<option value="beneficiada_patrocinada">Beneficiada patrocinada</option>
		<option value="pendiente_revision">Pendiente revisión</option>
		<option value="descartada">Descartada</option>
	</select>
	<label class="flex items-center gap-2 text-sm text-slate-700">
		<input
			type="checkbox"
			bind:checked={pendingOnly}
			onchange={() => {
				if (pendingOnly) status = '';
				load();
			}}
		/>
		Solo pendientes de revisión
	</label>
	<button class="btn-secondary" onclick={load}>Buscar</button>
</div>

{#if error}<p class="mb-2 text-sm text-red-600">{error}</p>{/if}

{#if showForm}
	<form class="card mb-4 grid gap-3 sm:grid-cols-2" onsubmit={save}>
		{#each [
			['nombre', 'Nombre'],
			['tipo', 'Tipo'],
			['nivelEducativo', 'Nivel'],
			['turno', 'Turno'],
			['direccion', 'Dirección'],
			['ciudad', 'Ciudad'],
			['zona', 'Zona'],
			['contactoNombre', 'Contacto'],
			['contactoEmail', 'Email'],
			['contactoTelefono', 'Teléfono'],
			['latitud', 'Latitud'],
			['longitud', 'Longitud']
		] as [k, label]}
			<label>
				<span class="label">{label}</span>
				<input class="input" bind:value={form[k]} required={k === 'nombre'} />
			</label>
		{/each}
		<button class="btn sm:col-span-2">Guardar</button>
	</form>
{/if}

<div class="grid gap-4 lg:grid-cols-2">
	<div class="card overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead class="text-xs uppercase text-slate-500">
				<tr>
					<th class="py-2">Nombre</th>
					<th>Nivel</th>
					<th>Estatus</th>
				</tr>
			</thead>
			<tbody>
				{#each list as i}
					<tr
						class="cursor-pointer border-t border-slate-100 hover:bg-slate-50 {selected === i.id
							? 'bg-teal-50'
							: ''}"
						onclick={() => openDetail(i.id)}
					>
						<td class="py-2 font-medium">{i.nombre}</td>
						<td>{i.nivelEducativo}</td>
						<td><span class="rounded bg-slate-100 px-2 py-0.5 text-xs">{i.statusAtencion}</span></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="card">
		{#if detail}
			<h2 class="font-medium">{detail.institution.nombre}</h2>
			<p class="mt-1 text-sm text-slate-600">
				{detail.institution.direccion}, {detail.institution.ciudad} · {detail.institution.zona}
			</p>
			<p class="mt-1 text-sm">Contacto: {detail.institution.contactoNombre} · {detail.institution.contactoEmail}</p>
			<p class="mt-1 text-xs text-slate-500">
				Estatus: {detail.institution.statusAtencion}
				· {detail.institution.validated ? 'validada' : 'sin validar'}
				{#if detail.institution.source === 'formulario_publico'} · origen: formulario público{/if}
			</p>

			{#if needsReview(detail.institution)}
				<div class="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
					<p class="text-sm font-medium text-amber-900">Pendiente de incorporar al catálogo oficial</p>
					<label class="mt-2 block">
						<span class="label">Notas de revisión (opcional)</span>
						<input class="input" bind:value={reviewNotes} placeholder="Observaciones internas" />
					</label>
					<div class="mt-2 flex flex-wrap gap-2">
						<button class="btn" disabled={reviewing} onclick={() => review('approve')}>
							Aprobar → catálogo
						</button>
						<button class="btn-secondary" disabled={reviewing} onclick={() => review('reject')}>
							Descartar
						</button>
					</div>
				</div>
			{:else if detail.institution.discarded}
				<p class="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
					Registro descartado
					{#if detail.institution.reviewNotes}: {detail.institution.reviewNotes}{/if}
				</p>
			{/if}

			{#if detail.duplicates?.length}
				<div class="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
					<p class="text-sm font-medium text-orange-900">
						Posibles duplicados ({detail.duplicates.length})
					</p>
					<ul class="mt-2 space-y-1.5 text-sm">
						{#each detail.duplicates as d}
							<li class="rounded border border-orange-100 bg-white px-2 py-1.5">
								<button
									type="button"
									class="text-left font-medium text-[var(--brand)] underline"
									onclick={() => openDetail(d.id)}
								>
									{d.nombre}
								</button>
								<span class="block text-xs text-slate-500">
									{d.statusAtencion} · {d.matchReasons?.join(', ')}
								</span>
							</li>
						{/each}
					</ul>
				</div>
			{/if}

			<h3 class="mt-4 text-sm font-medium">Línea de tiempo</h3>
			<ul class="mt-2 max-h-64 space-y-0 overflow-y-auto border-l-2 border-slate-200 pl-3 text-sm">
				{#each detail.timeline || [] as ev}
					<li class="relative pb-3">
						<span
							class="absolute -left-[1.05rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white {timelineDot(
								ev.type
							)}"
						></span>
						<p class="text-xs text-slate-400">
							{ev.at ? new Date(ev.at).toLocaleString('es-MX') : '—'}
							· {ev.type}
						</p>
						<p class="font-medium text-slate-800">{ev.title}</p>
						{#if ev.summary}
							<p class="text-xs text-slate-600">{ev.summary}</p>
						{/if}
					</li>
				{:else}
					<li class="text-slate-400">Sin eventos</li>
				{/each}
			</ul>

			<h3 class="mt-4 text-sm font-medium">Historial de visitas</h3>
			<ul class="mt-1 space-y-1 text-sm">
				{#each detail.visits as v}
					<li class="rounded border border-slate-100 px-2 py-1">
						{new Date(v.fecha).toLocaleDateString('es-MX')} · {v.modalidad} · {v.status}
						{#if v.asistentesReales != null}· {v.asistentesReales} asistentes{/if}
					</li>
				{:else}
					<li class="text-slate-400">Sin visitas</li>
				{/each}
			</ul>

			<h3 class="mt-4 text-sm font-medium">Solicitudes</h3>
			<ul class="mt-1 space-y-1 text-sm">
				{#each detail.requests as r}
					<li class="rounded border border-slate-100 px-2 py-1">{r.status} · {new Date(r.createdAt).toLocaleDateString('es-MX')}</li>
				{:else}
					<li class="text-slate-400">Sin solicitudes</li>
				{/each}
			</ul>

			<h3 class="mt-4 text-sm font-medium">Apoyos</h3>
			<ul class="mt-1 space-y-1 text-sm">
				{#each detail.supports as s}
					<li class="rounded border border-slate-100 px-2 py-1">{s.tipoBeneficio} · ${s.montoOtorgado}</li>
				{:else}
					<li class="text-slate-400">Sin apoyos</li>
				{/each}
			</ul>

			<h3 class="mt-4 text-sm font-medium">Observaciones administrativas</h3>
			<form class="mt-2 grid gap-2 sm:grid-cols-[140px_1fr_auto]" onsubmit={addObservation}>
				<select class="input" bind:value={obsForm.tipo}>
					<option value="control">Control</option>
					<option value="aclaracion">Aclaración</option>
					<option value="hallazgo">Hallazgo</option>
					<option value="otra">Otra</option>
				</select>
				<input class="input" bind:value={obsForm.text} placeholder="Nota administrativa…" required />
				<button class="btn" disabled={savingObs}>{savingObs ? '…' : 'Agregar'}</button>
			</form>
			<ul class="mt-2 max-h-40 space-y-1 overflow-y-auto text-sm">
				{#each detail.observations || [] as o}
					<li class="rounded border border-slate-100 px-2 py-1.5">
						<span class="rounded bg-slate-100 px-1.5 py-0.5 text-xs">{o.tipo}</span>
						{o.text}
						<span class="mt-0.5 block text-xs text-slate-400">
							{o.createdByEmail || 'usuario'} · {new Date(o.createdAt).toLocaleString('es-MX')}
						</span>
					</li>
				{:else}
					<li class="text-slate-400">Sin observaciones</li>
				{/each}
			</ul>

			<h3 class="mt-4 text-sm font-medium">Historial de cambios</h3>
			<ul class="mt-1 max-h-48 space-y-1 overflow-y-auto text-sm">
				{#each detail.changeHistory || [] as h}
					<li class="rounded border border-slate-100 px-2 py-1.5">
						<span class="font-medium">{h.action}</span>
						<span class="text-xs text-slate-500">
							· {h.userEmail || 'sistema'} · {new Date(h.at).toLocaleString('es-MX')}
						</span>
						{#if h.detail?.changes}
							<ul class="mt-1 text-xs text-slate-600">
								{#each Object.entries(h.detail.changes) as [field, diff]}
									<li>
										{field}: <span class="text-slate-400">{fmtVal(diff.from)}</span>
										→ <span>{fmtVal(diff.to)}</span>
									</li>
								{/each}
							</ul>
						{:else if h.detail?.nombre}
							<p class="text-xs text-slate-500">Alta: {h.detail.nombre}</p>
						{:else if h.detail?.notes}
							<p class="text-xs text-slate-500">{h.detail.notes}</p>
						{/if}
					</li>
				{:else}
					<li class="text-slate-400">Sin cambios registrados</li>
				{/each}
			</ul>
		{:else}
			<p class="text-sm text-slate-500">Selecciona una institución para ver historial</p>
		{/if}
	</div>
</div>
