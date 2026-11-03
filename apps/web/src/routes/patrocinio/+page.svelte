<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api.js';

	let sponsors = $state([]);
	let campaigns = $state([]);
	let programs = $state([]);
	let commitments = $state([]);
	let supports = $state([]);
	let institutions = $state([]);
	let error = $state('');
	let tab = $state('sponsors');

	let sponsorForm = $state({ nombre: '', tipo: 'organizacion', email: '', personaContacto: '', esDonante: true });
	let campaignForm = $state({
		nombre: '',
		fechaInicio: '',
		fechaFin: '',
		metaFinanciera: 0,
		metaAtencion: 0,
		descripcion: ''
	});
	let programForm = $state({
		nombre: '',
		modalidadVisita: 'patrocinada',
		objetivoAtencion: '',
		metaAtencion: 0,
		fechaInicio: ''
	});
	let supportForm = $state({
		programaApoyoId: '',
		institutionId: '',
		tipoBeneficio: 'visita_patrocinada',
		montoOtorgado: 0,
		fechaOtorgamiento: ''
	});

	async function load() {
		error = '';
		try {
			[sponsors, campaigns, programs, commitments, supports, institutions] = await Promise.all([
				api('/api/sponsorship/sponsors'),
				api('/api/sponsorship/campaigns'),
				api('/api/sponsorship/programs'),
				api('/api/sponsorship/commitments'),
				api('/api/sponsorship/supports'),
				api('/api/institutions')
			]);
		} catch (err) {
			error = err.message;
		}
	}

	async function addSponsor(e) {
		e.preventDefault();
		await api('/api/sponsorship/sponsors', { method: 'POST', body: sponsorForm });
		await load();
	}
	async function addCampaign(e) {
		e.preventDefault();
		await api('/api/sponsorship/campaigns', { method: 'POST', body: campaignForm });
		await load();
	}
	async function addProgram(e) {
		e.preventDefault();
		await api('/api/sponsorship/programs', { method: 'POST', body: programForm });
		await load();
	}
	async function addSupport(e) {
		e.preventDefault();
		await api('/api/sponsorship/supports', { method: 'POST', body: supportForm });
		await load();
	}

	onMount(load);
</script>

<div class="mb-4">
	<h1 class="text-xl font-semibold text-[var(--brand)]">Patrocinadores, campañas y metas</h1>
	<p class="text-sm text-slate-600">Relaciones institucionales y seguimiento de apoyos</p>
</div>

{#if error}<p class="mb-2 text-sm text-red-600">{error}</p>{/if}

<div class="mb-3 flex flex-wrap gap-2">
	{#each [['sponsors', 'Patrocinadores'], ['campaigns', 'Campañas'], ['programs', 'Programas'], ['supports', 'Apoyos']] as [k, label]}
		<button class={tab === k ? 'btn' : 'btn-secondary'} onclick={() => (tab = k)}>{label}</button>
	{/each}
</div>

{#if tab === 'sponsors'}
	<form class="card mb-4 grid gap-3 sm:grid-cols-2" onsubmit={addSponsor}>
		<label><span class="label">Nombre</span><input class="input" bind:value={sponsorForm.nombre} required /></label>
		<label>
			<span class="label">Tipo</span>
			<select class="input" bind:value={sponsorForm.tipo}>
				<option value="organizacion">Organización</option>
				<option value="persona">Persona</option>
			</select>
		</label>
		<label><span class="label">Contacto</span><input class="input" bind:value={sponsorForm.personaContacto} /></label>
		<label><span class="label">Email</span><input class="input" type="email" bind:value={sponsorForm.email} /></label>
		<button class="btn sm:col-span-2">Agregar</button>
	</form>
	<div class="card space-y-2 text-sm">
		{#each sponsors as s}
			<div class="flex justify-between border-b border-slate-100 py-2">
				<span><strong>{s.nombre}</strong> · {s.tipo}{s.esDonante ? ' · donante' : ''}</span>
				<span class="text-slate-500">{s.estaActivo ? 'activo' : 'inactivo'}</span>
			</div>
		{/each}
	</div>
{:else if tab === 'campaigns'}
	<form class="card mb-4 grid gap-3 sm:grid-cols-2" onsubmit={addCampaign}>
		<label><span class="label">Nombre</span><input class="input" bind:value={campaignForm.nombre} required /></label>
		<label><span class="label">Inicio</span><input class="input" type="date" bind:value={campaignForm.fechaInicio} required /></label>
		<label><span class="label">Fin</span><input class="input" type="date" bind:value={campaignForm.fechaFin} /></label>
		<label><span class="label">Meta atención</span><input class="input" type="number" bind:value={campaignForm.metaAtencion} /></label>
		<label class="sm:col-span-2"><span class="label">Descripción</span><input class="input" bind:value={campaignForm.descripcion} /></label>
		<button class="btn sm:col-span-2">Agregar campaña</button>
	</form>
	<div class="card space-y-2 text-sm">
		{#each campaigns as c}
			<div class="border-b border-slate-100 py-2">
				<strong>{c.nombre}</strong> · {c.estado} · meta {c.metaAtencion} personas
			</div>
		{/each}
	</div>
	<div class="card mt-4">
		<h2 class="mb-2 font-medium">Compromisos</h2>
		{#each commitments as c}
			<p class="border-b border-slate-100 py-2 text-sm">{c.patrocinadorNombre}: {c.descripcion} · ${c.montoComprometido} · {c.estado}</p>
		{:else}
			<p class="text-sm text-slate-400">Sin compromisos</p>
		{/each}
	</div>
{:else if tab === 'programs'}
	<form class="card mb-4 grid gap-3 sm:grid-cols-2" onsubmit={addProgram}>
		<label><span class="label">Nombre</span><input class="input" bind:value={programForm.nombre} required /></label>
		<label><span class="label">Modalidad</span><input class="input" bind:value={programForm.modalidadVisita} /></label>
		<label><span class="label">Inicio</span><input class="input" type="date" bind:value={programForm.fechaInicio} required /></label>
		<label><span class="label">Meta</span><input class="input" type="number" bind:value={programForm.metaAtencion} /></label>
		<label class="sm:col-span-2"><span class="label">Objetivo</span><input class="input" bind:value={programForm.objetivoAtencion} /></label>
		<button class="btn sm:col-span-2">Agregar programa</button>
	</form>
	<div class="card space-y-2 text-sm">
		{#each programs as p}
			<div class="border-b border-slate-100 py-2"><strong>{p.nombre}</strong> · {p.modalidadVisita} · meta {p.metaAtencion}</div>
		{/each}
	</div>
{:else}
	<form class="card mb-4 grid gap-3 sm:grid-cols-2" onsubmit={addSupport}>
		<label>
			<span class="label">Programa</span>
			<select class="input" bind:value={supportForm.programaApoyoId} required>
				<option value="">—</option>
				{#each programs as p}<option value={p.id}>{p.nombre}</option>{/each}
			</select>
		</label>
		<label>
			<span class="label">Institución</span>
			<select class="input" bind:value={supportForm.institutionId} required>
				<option value="">—</option>
				{#each institutions as i}<option value={i.id}>{i.nombre}</option>{/each}
			</select>
		</label>
		<label><span class="label">Tipo beneficio</span><input class="input" bind:value={supportForm.tipoBeneficio} /></label>
		<label><span class="label">Monto</span><input class="input" type="number" bind:value={supportForm.montoOtorgado} /></label>
		<label><span class="label">Fecha</span><input class="input" type="date" bind:value={supportForm.fechaOtorgamiento} required /></label>
		<button class="btn sm:col-span-2">Registrar apoyo</button>
	</form>
	<div class="card space-y-2 text-sm">
		{#each supports as s}
			<div class="border-b border-slate-100 py-2">
				{s.tipoBeneficio} · ${s.montoOtorgado} · {new Date(s.fechaOtorgamiento).toLocaleDateString('es-MX')}
				{#if s.validado} · validado{/if}
			</div>
		{/each}
	</div>
{/if}
