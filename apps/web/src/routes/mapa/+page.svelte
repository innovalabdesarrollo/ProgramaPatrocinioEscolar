<script>
	import { onMount, onDestroy } from 'svelte';
	import { api } from '$lib/api.js';

	let mapEl = $state(null);
	let status = $state('');
	let nivel = $state('');
	let zona = $state('');
	let turno = $state('');
	let tipo = $state('');
	let sponsorId = $state('');
	let campaignId = $state('');
	let from = $state('');
	let to = $state('');
	let error = $state('');
	let count = $state(0);
	let meta = $state({ zonas: [], turnos: [], tipos: [], niveles: [] });
	let sponsors = $state([]);
	let campaigns = $state([]);
	let zonesData = $state(null);
	let selectedZone = $state(null);
	/** @type {any} */
	let map;
	/** @type {any} */
	let layer;
	/** @type {any} */
	let L;

	const legend = [
		['beneficiada_patrocinada', '#15803d', 'Patrocinada'],
		['beneficiada_pagada', '#1d4ed8', 'Pagada'],
		['en_espera', '#ca8a04', 'En espera'],
		['programada', '#7c3aed', 'Programada'],
		['pendiente_revision', '#ea580c', 'Pendiente'],
		['no_atendida', '#64748b', 'No atendida']
	];

	function periodQuery() {
		const q = new URLSearchParams();
		if (sponsorId) q.set('sponsorId', sponsorId);
		if (campaignId) q.set('campaignId', campaignId);
		if (from) q.set('from', from);
		if (to) q.set('to', to);
		return q;
	}

	async function loadZones() {
		try {
			zonesData = await api(`/api/map/zones?${periodQuery()}`);
			if (!zona) {
				selectedZone = null;
			} else {
				const key = zona === '__none__' ? 'Sin zona' : zona;
				selectedZone = zonesData.zones?.find((z) => z.zona === key) || selectedZone;
			}
		} catch (err) {
			error = err.message;
		}
	}

	async function loadMap() {
		if (!L || !map) return;
		error = '';
		try {
			const q = periodQuery();
			if (status) q.set('status', status);
			if (nivel) q.set('nivel', nivel);
			if (zona) q.set('zona', zona);
			if (turno) q.set('turno', turno);
			if (tipo) q.set('tipo', tipo);
			const [points] = await Promise.all([api(`/api/map/coverage?${q}`), loadZones()]);
			count = points.length;
			if (layer) layer.clearLayers();
			else layer = L.layerGroup().addTo(map);
			for (const p of points) {
				const m = L.circleMarker([p.latitud, p.longitud], {
					radius: 8,
					color: '#fff',
					weight: 1,
					fillColor: p.color,
					fillOpacity: 0.9
				});
				m.bindPopup(
					`<strong>${p.nombre}</strong><br/>${p.statusAtencion}<br/>${p.nivelEducativo || ''} · ${p.zona || ''} · ${p.turno || ''} · ${p.tipo || ''}`
				);
				layer.addLayer(m);
			}
		} catch (err) {
			error = err.message;
		}
	}

	function selectZone(z) {
		if (selectedZone?.zona === z.zona) {
			zona = '';
			selectedZone = null;
		} else {
			selectedZone = z;
			zona = z.zona === 'Sin zona' ? '__none__' : z.zona;
			if (map && z.latAvg != null && z.lngAvg != null) {
				map.setView([z.latAvg, z.lngAvg], 12);
			}
		}
		loadMap();
	}

	function clearExtra() {
		zona = '';
		turno = '';
		tipo = '';
		sponsorId = '';
		campaignId = '';
		from = '';
		to = '';
		selectedZone = null;
		loadMap();
	}

	onMount(async () => {
		L = (await import('leaflet')).default;
		await import('leaflet/dist/leaflet.css');
		map = L.map(mapEl).setView([31.69, -106.42], 11);
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap'
		}).addTo(map);
		try {
			[meta, sponsors, campaigns] = await Promise.all([
				api('/api/map/meta'),
				api('/api/sponsorship/sponsors'),
				api('/api/sponsorship/campaigns')
			]);
		} catch (err) {
			error = err.message;
		}
		await loadMap();
	});

	onDestroy(() => {
		if (map) map.remove();
	});
</script>

<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
	<div>
		<h1 class="text-xl font-semibold text-[var(--brand)]">Mapa de cobertura</h1>
		<p class="text-sm text-slate-600">
			{count} instituciones con ubicación · filtros por estatus, nivel, zona, turno, tipo, patrocinio y periodo
		</p>
	</div>
	<div class="flex flex-wrap gap-2">
		<button class="btn-secondary" onclick={loadMap}>Actualizar</button>
		<button class="btn-secondary" onclick={clearExtra}>Limpiar extras</button>
	</div>
</div>

<div class="card mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
	<select class="input" bind:value={status} onchange={loadMap}>
		<option value="">Estatus: todos</option>
		{#each legend as [v, , label]}
			<option value={v}>{label}</option>
		{/each}
	</select>
	<select class="input" bind:value={nivel} onchange={loadMap}>
		<option value="">Nivel: todos</option>
		{#each meta.niveles || [] as n}
			<option value={n}>{n}</option>
		{/each}
	</select>
	<select class="input" bind:value={zona} onchange={loadMap}>
		<option value="">Zona: todas</option>
		{#each meta.zonas || [] as z}
			<option value={z}>{z}</option>
		{/each}
	</select>
	<select class="input" bind:value={turno} onchange={loadMap}>
		<option value="">Turno: todos</option>
		{#each meta.turnos || [] as t}
			<option value={t}>{t}</option>
		{/each}
	</select>
	<select class="input" bind:value={tipo} onchange={loadMap}>
		<option value="">Tipo: todos</option>
		{#each meta.tipos || [] as t}
			<option value={t}>{t}</option>
		{/each}
	</select>
	<select class="input" bind:value={sponsorId} onchange={loadMap}>
		<option value="">Patrocinador: todos</option>
		{#each sponsors as s}
			<option value={s.id}>{s.nombre}</option>
		{/each}
	</select>
	<select class="input" bind:value={campaignId} onchange={loadMap}>
		<option value="">Campaña: todas</option>
		{#each campaigns as c}
			<option value={c.id}>{c.nombre}</option>
		{/each}
	</select>
	<div class="flex gap-2">
		<input class="input" type="date" bind:value={from} onchange={loadMap} title="Desde" />
		<input class="input" type="date" bind:value={to} onchange={loadMap} title="Hasta" />
	</div>
</div>

{#if error}<p class="mb-2 text-sm text-red-600">{error}</p>{/if}

<div class="card mb-3 flex flex-wrap gap-3 text-xs">
	{#each legend as [, color, label]}
		<span class="inline-flex items-center gap-1.5">
			<span class="inline-block h-3 w-3 rounded-full" style="background:{color}"></span>
			{label}
		</span>
	{/each}
</div>

<div class="mb-3 grid gap-3 lg:grid-cols-[240px_1fr]">
	<div class="card">
		<h2 class="mb-1 text-sm font-medium text-[var(--brand)]">Cobertura por zona</h2>
		<p class="mb-2 text-xs text-slate-500">
			Clic en una zona para filtrar el mapa · {zonesData?.total ?? 0} con ubicación
		</p>
		{#if zonesData?.zones?.length}
			<ul class="max-h-[50vh] space-y-1 overflow-y-auto">
				{#each zonesData.zones as z}
					<li>
						<button
							type="button"
							class="w-full rounded-lg border px-2 py-1.5 text-left text-sm transition {selectedZone?.zona === z.zona
								? 'border-[var(--brand)] bg-[var(--brand)]/5'
								: 'border-slate-200 hover:bg-slate-50'}"
							onclick={() => selectZone(z)}
						>
							<div class="flex items-center justify-between gap-2">
								<span class="font-medium">{z.zona}</span>
								<span class="text-xs text-slate-500">{z.total}</span>
							</div>
							<p class="text-[11px] text-slate-500">
								{z.beneficiadas} benef. · {z.enEspera} espera · {z.noAtendidas} sin atend.
							</p>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-xs text-slate-500">Sin zonas para los filtros actuales.</p>
		{/if}
		{#if selectedZone}
			<div class="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs">
				<p class="font-medium text-slate-800">Resumen · {selectedZone.zona}</p>
				<ul class="mt-1 space-y-0.5 text-slate-600">
					<li>Total: {selectedZone.total}</li>
					<li>Beneficiadas: {selectedZone.beneficiadas}</li>
					<li>En espera: {selectedZone.enEspera}</li>
					<li>Programadas: {selectedZone.programadas}</li>
					<li>No atendidas: {selectedZone.noAtendidas}</li>
				</ul>
			</div>
		{/if}
	</div>
	<div class="card overflow-hidden p-0">
		<div bind:this={mapEl} class="h-[60vh] min-h-[320px] w-full"></div>
	</div>
</div>
