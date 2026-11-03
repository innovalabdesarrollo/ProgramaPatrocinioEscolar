<script>
	import { api } from '$lib/api.js';

	let email = $state('');
	let bag = $state(null);
	let error = $state('');
	let ok = $state('');
	let editing = $state(null);
	let form = $state(emptyForm());
	let saving = $state(false);
	let editingInst = $state(null);
	let instForm = $state({});
	let visitEdit = $state(null);
	let visitForm = $state({ nuevaFecha: '', horario: '', motivo: '' });

	function emptyForm() {
		return {
			solicitanteNombre: '',
			solicitanteTelefono: '',
			cantidadEstimada: 0,
			modalidadPreferida: 'patrocinada',
			nivelEducativo: '',
			fechaPreferida: '',
			complementNotes: ''
		};
	}

	async function search(e) {
		e?.preventDefault();
		error = '';
		ok = '';
		editing = null;
		editingInst = null;
		visitEdit = null;
		try {
			bag = await api(`/api/public/my-records?email=${encodeURIComponent(email)}`);
		} catch (err) {
			error = err.message;
			bag = null;
		}
	}

	function startEdit(r) {
		editing = r.id;
		ok = '';
		form = {
			solicitanteNombre: r.solicitanteNombre || '',
			solicitanteTelefono: r.solicitanteTelefono || '',
			cantidadEstimada: r.cantidadEstimada || 0,
			modalidadPreferida: r.modalidadPreferida || 'patrocinada',
			nivelEducativo: r.nivelEducativo || '',
			fechaPreferida: r.fechaPreferida
				? new Date(r.fechaPreferida).toISOString().slice(0, 10)
				: '',
			complementNotes: ''
		};
	}

	async function submitComplement(e) {
		e.preventDefault();
		if (!editing) return;
		saving = true;
		error = '';
		ok = '';
		try {
			const data = await api('/api/public/complement-request', {
				method: 'POST',
				body: {
					id: editing,
					email,
					...form,
					fechaPreferida: form.fechaPreferida || null
				}
			});
			ok = data.message;
			editing = null;
			await search();
		} catch (err) {
			error = err.message;
		} finally {
			saving = false;
		}
	}

	function startInstEdit(i) {
		editingInst = i.id;
		visitEdit = null;
		ok = '';
		instForm = {
			nombre: i.nombre || '',
			tipo: i.tipo || 'escuela',
			nivelEducativo: i.nivelEducativo || '',
			turno: i.turno || '',
			direccion: i.direccion || '',
			ciudad: i.ciudad || '',
			estado: i.estado || '',
			zona: i.zona || '',
			contactoNombre: i.contactoNombre || '',
			contactoTelefono: i.contactoTelefono || '',
			motivo: ''
		};
	}

	async function submitInst(e) {
		e.preventDefault();
		if (!editingInst) return;
		saving = true;
		error = '';
		ok = '';
		try {
			const data = await api('/api/public/update-institution', {
				method: 'POST',
				body: { email, institutionId: editingInst, ...instForm }
			});
			ok = data.message;
			editingInst = null;
			await search();
		} catch (err) {
			error = err.message;
		} finally {
			saving = false;
		}
	}

	function startVisit(v, action) {
		visitEdit = { id: v.id, action };
		editingInst = null;
		ok = '';
		visitForm = {
			nuevaFecha: v.fecha ? new Date(v.fecha).toISOString().slice(0, 10) : '',
			horario: v.horario || '',
			motivo: ''
		};
	}

	async function submitVisit(e) {
		e.preventDefault();
		if (!visitEdit) return;
		saving = true;
		error = '';
		ok = '';
		try {
			const body = {
				email,
				visitId: visitEdit.id,
				action: visitEdit.action,
				motivo: visitForm.motivo
			};
			if (visitEdit.action === 'reschedule') {
				body.nuevaFecha = visitForm.nuevaFecha;
				body.horario = visitForm.horario;
			}
			const data = await api('/api/public/visit-action', { method: 'POST', body });
			ok = data.message;
			visitEdit = null;
			await search();
		} catch (err) {
			error = err.message;
		} finally {
			saving = false;
		}
	}
</script>

<div class="min-h-screen bg-slate-50 px-4 py-8">
	<div class="mx-auto max-w-lg">
		<a href="/formulario" class="text-sm text-[var(--brand)] underline">← Formulario</a>
		<h1 class="mt-3 text-xl font-semibold text-[var(--brand)]">Consulta institucional</h1>
		<p class="mt-1 text-sm text-slate-600">
			Con el email de contacto: solicitudes, datos de institución (sujetos a revisión) y visitas.
		</p>
		<form class="card mt-4 space-y-3" onsubmit={search}>
			<label>
				<span class="label">Email del solicitante / contacto</span>
				<input class="input" type="email" bind:value={email} required />
			</label>
			<button class="btn w-full">Consultar</button>
		</form>
		{#if error}<p class="mt-2 text-sm text-red-600">{error}</p>{/if}
		{#if ok}<p class="mt-2 text-sm text-green-700">{ok}</p>{/if}

		{#if bag}
			<section class="mt-6">
				<h2 class="mb-2 text-sm font-semibold text-[var(--brand)]">Instituciones</h2>
				{#if bag.institutions?.length}
					<ul class="space-y-3">
						{#each bag.institutions as i}
							<li class="card text-sm">
								<strong>{i.nombre}</strong><br />
								{i.statusAtencion}
								{#if i.pendingPublicUpdate}
									· <span class="text-amber-700">cambio pendiente de revisión</span>
								{/if}
								{#if editingInst === i.id}
									<form class="mt-3 grid gap-2" onsubmit={submitInst}>
										<label><span class="label">Nombre</span><input class="input" bind:value={instForm.nombre} required /></label>
										<label><span class="label">Dirección</span><input class="input" bind:value={instForm.direccion} /></label>
										<label><span class="label">Ciudad</span><input class="input" bind:value={instForm.ciudad} /></label>
										<label><span class="label">Zona</span><input class="input" bind:value={instForm.zona} /></label>
										<label><span class="label">Contacto</span><input class="input" bind:value={instForm.contactoNombre} /></label>
										<label><span class="label">Teléfono</span><input class="input" bind:value={instForm.contactoTelefono} /></label>
										<label><span class="label">Motivo del cambio</span><textarea class="input" rows="2" bind:value={instForm.motivo}></textarea></label>
										<div class="flex gap-2">
											<button class="btn" disabled={saving}>Enviar a revisión</button>
											<button type="button" class="btn-secondary" onclick={() => (editingInst = null)}>Cancelar</button>
										</div>
									</form>
								{:else}
									<button class="btn mt-2 text-sm" onclick={() => startInstEdit(i)}>Actualizar datos</button>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-xs text-slate-500">Sin instituciones con este email de contacto.</p>
				{/if}
			</section>

			<section class="mt-6">
				<h2 class="mb-2 text-sm font-semibold text-[var(--brand)]">Solicitudes</h2>
				{#if bag.requests?.length}
					<ul class="space-y-3">
						{#each bag.requests as r}
							<li class="card text-sm">
								<strong>{r.institutionNombre}</strong><br />
								Estado: {r.status}<br />
								Folio: {r.id}<br />
								Fecha: {new Date(r.createdAt).toLocaleString('es-MX')}
								{#if r.infoRequested}
									<p class="mt-2 rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-amber-900">
										<strong>Información solicitada:</strong> {r.infoRequested}
									</p>
								{/if}
								{#if r.needsComplement}
									{#if editing === r.id}
										<form class="mt-3 grid gap-2" onsubmit={submitComplement}>
											<label>
												<span class="label">Nombre contacto</span>
												<input class="input" bind:value={form.solicitanteNombre} required />
											</label>
											<label>
												<span class="label">Teléfono</span>
												<input class="input" bind:value={form.solicitanteTelefono} />
											</label>
											<label>
												<span class="label">Cantidad estimada</span>
												<input class="input" type="number" bind:value={form.cantidadEstimada} />
											</label>
											<label>
												<span class="label">Modalidad</span>
												<select class="input" bind:value={form.modalidadPreferida}>
													<option value="patrocinada">Patrocinada</option>
													<option value="pagada">Pagada</option>
												</select>
											</label>
											<label>
												<span class="label">Nivel educativo</span>
												<input class="input" bind:value={form.nivelEducativo} />
											</label>
											<label>
												<span class="label">Fecha preferida</span>
												<input class="input" type="date" bind:value={form.fechaPreferida} />
											</label>
											<label>
												<span class="label">Notas / respuesta</span>
												<textarea class="input" rows="2" bind:value={form.complementNotes}></textarea>
											</label>
											<div class="flex gap-2">
												<button class="btn" disabled={saving}>{saving ? 'Enviando…' : 'Enviar complemento'}</button>
												<button type="button" class="btn-secondary" onclick={() => (editing = null)}>Cancelar</button>
											</div>
										</form>
									{:else}
										<button class="btn mt-2 text-sm" onclick={() => startEdit(r)}>Complementar información</button>
									{/if}
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-xs text-slate-500">Sin solicitudes para este email.</p>
				{/if}
			</section>

			<section class="mt-6">
				<h2 class="mb-2 text-sm font-semibold text-[var(--brand)]">Visitas</h2>
				{#if bag.visits?.length}
					<ul class="space-y-3">
						{#each bag.visits as v}
							<li class="card text-sm">
								<strong>{v.actividad || 'Visita'}</strong> · {v.status}<br />
								{v.fecha ? new Date(v.fecha).toISOString().slice(0, 10) : '—'} {v.horario || ''}<br />
								Modalidad: {v.modalidad || '—'}
								{#if v.canModify}
									{#if visitEdit?.id === v.id}
										<form class="mt-3 grid gap-2" onsubmit={submitVisit}>
											{#if visitEdit.action === 'reschedule'}
												<label>
													<span class="label">Nueva fecha</span>
													<input class="input" type="date" bind:value={visitForm.nuevaFecha} required />
												</label>
												<label>
													<span class="label">Horario</span>
													<input class="input" bind:value={visitForm.horario} />
												</label>
											{/if}
											<label>
												<span class="label">Motivo</span>
												<textarea class="input" rows="2" bind:value={visitForm.motivo}></textarea>
											</label>
											<div class="flex flex-wrap gap-2">
												<button class="btn" disabled={saving}>
													{visitEdit.action === 'cancel' ? 'Confirmar cancelación' : 'Solicitar reprogramación'}
												</button>
												<button type="button" class="btn-secondary" onclick={() => (visitEdit = null)}>Cerrar</button>
											</div>
										</form>
									{:else}
										<div class="mt-2 flex flex-wrap gap-2">
											<button class="btn text-sm" onclick={() => startVisit(v, 'reschedule')}>Reprogramar</button>
											<button class="btn-secondary text-sm" onclick={() => startVisit(v, 'cancel')}>Cancelar visita</button>
										</div>
									{/if}
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="text-xs text-slate-500">Sin visitas vinculadas.</p>
				{/if}
			</section>
		{/if}
	</div>
</div>
