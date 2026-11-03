<script>
	import { onMount } from 'svelte';
	import { api, API_BASE, getUser } from '$lib/api.js';

	let data = $state(null);
	let alertsData = $state(null);
	let sponsors = $state([]);
	let error = $state('');
	let from = $state('');
	let to = $state('');
	let exportStatus = $state('');
	let exportCampaignId = $state('');
	let exportSponsorId = $state('');
	let drill = $state(null);
	let drillLoading = $state(false);
	let drillLabel = $state('');

	async function load() {
		error = '';
		try {
			const q = new URLSearchParams();
			if (from) q.set('from', from);
			if (to) q.set('to', to);
			[data, alertsData, sponsors] = await Promise.all([
				api(`/api/indicators/dashboard?${q}`),
				api('/api/indicators/alerts'),
				api('/api/sponsorship/sponsors')
			]);
		} catch (err) {
			error = err.message;
		}
	}

	onMount(load);

	async function openDrill(metric, label, campaignId = '') {
		drillLabel = label;
		drillLoading = true;
		drill = null;
		try {
			const q = new URLSearchParams({ metric });
			if (from) q.set('from', from);
			if (to) q.set('to', to);
			if (campaignId) q.set('campaignId', campaignId);
			drill = await api(`/api/indicators/drilldown?${q}`);
		} catch (err) {
			error = err.message;
		} finally {
			drillLoading = false;
		}
	}

	function itemTitle(it) {
		if (drill?.kind === 'institutions') return it.nombre;
		if (drill?.kind === 'requests') return it.institutionNombre || it.solicitanteNombre || it.id;
		if (it.fecha) {
			const d = typeof it.fecha === 'string' ? it.fecha.slice(0, 10) : '';
			return `${d} ${it.horario || ''} · ${it.modalidad || ''}`.trim();
		}
		return it.id;
	}

	function itemSub(it) {
		if (drill?.kind === 'institutions') return `${it.statusAtencion || ''} · ${it.zona || ''} · ${it.nivelEducativo || ''}`;
		if (drill?.kind === 'requests') return `${it.status || ''} · ${it.solicitanteNombre || ''}`;
		return `asistentes ${it.asistentes ?? '—'} · inst ${it.institutionId || '—'}`;
	}

	function severityClass(sev) {
		if (sev === 'high') return 'border-red-200 bg-red-50 text-red-900';
		if (sev === 'medium') return 'border-amber-200 bg-amber-50 text-amber-950';
		return 'border-slate-200 bg-slate-50 text-slate-800';
	}

	async function exportCsv(type) {
		const token = localStorage.getItem('mc_token');
		const q = new URLSearchParams({ type });
		if (from) q.set('from', from);
		if (to) q.set('to', to);
		if (exportStatus) q.set('status', exportStatus);
		if (exportCampaignId) q.set('campaignId', exportCampaignId);
		if (exportSponsorId) q.set('sponsorId', exportSponsorId);
		const res = await fetch(`${API_BASE}/api/indicators/export?${q}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		const blob = await res.blob();
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = `${type}.csv`;
		a.click();
	}

	function clearPeriod() {
		from = '';
		to = '';
		load();
	}

	const user = getUser();

	function barColor(nivel) {
		if (nivel === 'cumplida') return 'bg-emerald-600';
		if (nivel === 'en_curso') return 'bg-amber-500';
		if (nivel === 'rezagada') return 'bg-orange-600';
		return 'bg-slate-300';
	}

	function nivelLabel(nivel) {
		return (
			{
				cumplida: 'Cumplida',
				en_curso: 'En curso',
				rezagada: 'Rezagada',
				sin_meta: 'Sin meta'
			}[nivel] || nivel
		);
	}
</script>

<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
	<div>
		<h1 class="text-xl font-semibold text-[var(--brand)]">Tablero ejecutivo</h1>
		<p class="text-sm text-slate-600">
			Indicadores de cobertura, atención y patrocinio
			{#if data?.period?.active}
				· periodo activo (instituciones con visitas en el rango)
			{/if}
		</p>
	</div>
	<div class="flex flex-wrap gap-2">
		<input class="input w-auto" type="date" bind:value={from} />
		<input class="input w-auto" type="date" bind:value={to} />
		<button class="btn" onclick={load}>Filtrar</button>
		<button class="btn-secondary" onclick={clearPeriod}>Todo el tiempo</button>
	</div>
</div>

<div class="card mb-4">
	<p class="mb-2 text-sm font-medium text-[var(--brand)]">Exportar CSV</p>
	<p class="mb-2 text-xs text-slate-500">
		Usa el periodo del tablero y, opcionalmente, estatus / campaña / patrocinador
	</p>
	<div class="flex flex-wrap gap-2">
		<select class="input w-auto" bind:value={exportStatus}>
			<option value="">Estatus: todos</option>
			<option value="beneficiada_patrocinada">Benef. patrocinada</option>
			<option value="beneficiada_pagada">Benef. pagada</option>
			<option value="en_espera">En espera</option>
			<option value="no_atendida">No atendida</option>
			<option value="programada">Programada</option>
			<option value="realizada">Visita realizada</option>
			<option value="confirmada">Visita confirmada</option>
			<option value="cancelada">Visita cancelada</option>
		</select>
		<select class="input w-auto" bind:value={exportCampaignId}>
			<option value="">Campaña: todas</option>
			{#each data?.campaigns || [] as c}
				<option value={c.id}>{c.nombre}</option>
			{/each}
		</select>
		<select class="input w-auto" bind:value={exportSponsorId}>
			<option value="">Patrocinador: todos</option>
			{#each sponsors as s}
				<option value={s.id}>{s.nombre}</option>
			{/each}
		</select>
		<button class="btn-secondary" onclick={() => exportCsv('institutions')}>CSV instituciones</button>
		<button class="btn-secondary" onclick={() => exportCsv('visits')}>CSV visitas</button>
	</div>
</div>

{#if error}
	<p class="mb-3 text-sm text-red-600">{error}</p>
{/if}

{#if alertsData}
	<div class="card mb-4">
		<div class="mb-2 flex flex-wrap items-end justify-between gap-2">
			<div>
				<h2 class="font-medium text-[var(--brand)]">Alertas de seguimiento</h2>
				<p class="text-xs text-slate-500">
					Solo en pantalla (sin correo) · espera ≥{alertsData.thresholds?.waitDays}d · campaña &lt;{alertsData.thresholds?.campaignPct}%
				</p>
			</div>
			<p class="text-xs text-slate-500">
				{alertsData.counts?.high || 0} altas · {alertsData.counts?.medium || 0} medias · {alertsData.counts?.low || 0} bajas
			</p>
		</div>
		{#if alertsData.alerts?.length}
			<ul class="max-h-56 space-y-2 overflow-y-auto">
				{#each alertsData.alerts as a}
					<li class="rounded-lg border px-3 py-2 text-sm {severityClass(a.severity)}">
						<div class="flex flex-wrap items-start justify-between gap-2">
							<div>
								<p class="font-medium">{a.title}</p>
								<p class="text-xs opacity-80">{a.detail}</p>
								<p class="mt-0.5 text-[10px] uppercase tracking-wide opacity-60">{a.category} · {a.severity}</p>
							</div>
							{#if a.href}
								<a class="shrink-0 text-xs font-medium underline" href={a.href}>Ir</a>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="text-sm text-slate-500">Sin alertas por ahora.</p>
		{/if}
	</div>
{/if}

{#if data}
	<div class="grid grid-cols-2 gap-3 md:grid-cols-4">
		{#each [
			['Instituciones', data.institutionsTotal, 'institutions'],
			['Beneficiadas', data.institutionsBeneficiadas, 'beneficiadas'],
			['En espera', data.institutionsEnEspera, 'en_espera'],
			['No atendidas', data.institutionsNoAtendidas, 'no_atendidas'],
			['Visitas pagadas', data.visitasPagadas, 'visitas_pagadas'],
			['Visitas patrocinadas', data.visitasPatrocinadas, 'visitas_patrocinadas'],
			['Personas atendidas', data.personasAtendidas, 'personas'],
			['Solicitudes pendientes', data.solicitudesPendientes, 'solicitudes']
		] as [label, value, metric]}
			<button
				type="button"
				class="card text-left transition hover:ring-2 hover:ring-[var(--brand)]/30"
				onclick={() => openDrill(metric, label)}
			>
				<p class="text-xs uppercase tracking-wide text-slate-500">{label}</p>
				<p class="mt-1 text-2xl font-semibold text-[var(--brand)]">{value}</p>
				<p class="mt-1 text-[10px] text-slate-400">Ver detalle</p>
			</button>
		{/each}
	</div>

	{#if drillLoading || drill}
		<div class="card mt-4">
			<div class="mb-2 flex items-center justify-between gap-2">
				<h2 class="font-medium text-[var(--brand)]">Detalle · {drillLabel}</h2>
				<button class="btn-secondary text-xs" type="button" onclick={() => (drill = null)}>Cerrar</button>
			</div>
			{#if drillLoading}
				<p class="text-sm text-slate-500">Cargando…</p>
			{:else if drill}
				<p class="mb-2 text-xs text-slate-500">{drill.total} registros (muestra hasta {drill.items?.length || 0})</p>
				<ul class="max-h-56 space-y-1 overflow-y-auto text-sm">
					{#each drill.items || [] as it}
						<li class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-1.5">
							<div>
								<p class="font-medium">{itemTitle(it)}</p>
								<p class="text-xs text-slate-500">{itemSub(it)}</p>
							</div>
							{#if it.href}
								<a class="text-xs underline" href={it.href}>Ir</a>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}

	<div class="mt-4 grid gap-4 md:grid-cols-2">
		<div class="card">
			<h2 class="mb-2 font-medium">Por zona</h2>
			<ul class="space-y-1 text-sm">
				{#each data.byZona as z}
					<li class="flex justify-between"><span>{z.zona}</span><span class="font-medium">{z.total}</span></li>
				{/each}
			</ul>
		</div>
		<div class="card">
			<h2 class="mb-2 font-medium">Por nivel educativo</h2>
			<ul class="space-y-1 text-sm">
				{#each data.byNivel as z}
					<li class="flex justify-between"><span>{z.nivel}</span><span class="font-medium">{z.total}</span></li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="card mt-4">
		<h2 class="mb-1 font-medium">Cumplimiento de metas por campaña</h2>
		<p class="mb-3 text-xs text-slate-500">
			Verde ≥100% · ámbar ≥70% · naranja &lt;70% · personas atendidas vs meta de atención
		</p>

		{#if data.campaigns?.length}
			<div class="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.campaigns as c}
					<button
						type="button"
						class="rounded-xl border border-slate-200 p-3 text-left transition hover:ring-2 hover:ring-[var(--brand)]/30"
						onclick={() => openDrill('campaign', c.nombre, c.id)}
					>
						<div class="flex items-start justify-between gap-2">
							<p class="font-medium text-[var(--brand)]">{c.nombre}</p>
							<span
								class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide
								{c.nivelCumplimiento === 'cumplida'
									? 'bg-emerald-100 text-emerald-800'
									: c.nivelCumplimiento === 'en_curso'
										? 'bg-amber-100 text-amber-900'
										: c.nivelCumplimiento === 'rezagada'
											? 'bg-orange-100 text-orange-900'
											: 'bg-slate-100 text-slate-600'}"
							>
								{nivelLabel(c.nivelCumplimiento)}
							</span>
						</div>
						<p class="mt-2 text-2xl font-semibold tabular-nums">
							{c.pctCumplimiento == null ? '—' : `${c.pctCumplimiento}%`}
						</p>
						<div class="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
							<div
								class="h-full rounded-full transition-all {barColor(c.nivelCumplimiento)}"
								style="width: {c.pctBar ?? 0}%"
							></div>
						</div>
						<p class="mt-2 text-xs text-slate-600">
							{c.personasAtendidas} / {c.metaAtencion || '—'} personas · {c.visitasRealizadas} visitas
							{#if c.faltantePersonas != null && c.faltantePersonas > 0}
								· faltan {c.faltantePersonas}
							{/if}
						</p>
						<p class="mt-1 text-[10px] text-slate-400">Clic para ver visitas</p>
					</button>
				{/each}
			</div>
		{/if}

		<div class="overflow-x-auto">
			<table class="w-full min-w-[520px] text-left text-sm">
				<thead class="text-xs uppercase text-slate-500">
					<tr>
						<th class="py-2">Campaña</th>
						<th>Meta</th>
						<th>Personas</th>
						<th>Faltan</th>
						<th>Visitas</th>
						<th>% / avance</th>
					</tr>
				</thead>
				<tbody>
					{#each data.campaigns as c}
						<tr class="border-t border-slate-100">
							<td class="py-2">{c.nombre}</td>
							<td>{c.metaAtencion}</td>
							<td>{c.personasAtendidas}</td>
							<td>{c.faltantePersonas ?? '—'}</td>
							<td>{c.visitasRealizadas}</td>
							<td class="min-w-[140px]">
								<div class="flex items-center gap-2">
									<span class="w-10 tabular-nums"
										>{c.pctCumplimiento == null ? '—' : `${c.pctCumplimiento}%`}</span
									>
									<div class="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
										<div
											class="h-full rounded-full {barColor(c.nivelCumplimiento)}"
											style="width: {c.pctBar ?? 0}%"
										></div>
									</div>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<p class="mt-2 text-xs text-slate-400">Actualizado: {new Date(data.updatedAt).toLocaleString('es-MX')} · {user?.rol}</p>
	</div>
{:else if !error}
	<p class="text-sm text-slate-500">Cargando…</p>
{/if}
