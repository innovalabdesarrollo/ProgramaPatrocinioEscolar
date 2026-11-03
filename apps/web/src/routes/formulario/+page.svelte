<script>
	import { api } from '$lib/api.js';

	let ok = $state('');
	let error = $state('');
	let form = $state({
		nombre: '',
		tipo: 'escuela',
		nivelEducativo: 'primaria',
		turno: 'matutino',
		direccion: '',
		ciudad: '',
		estado: 'Chihuahua',
		zona: '',
		contactoNombre: '',
		contactoEmail: '',
		contactoTelefono: '',
		latitud: '',
		longitud: '',
		enviarSolicitud: true,
		cantidadEstimada: 30,
		modalidadPreferida: 'patrocinada',
		solicitudNotas: ''
	});

	async function submit(e) {
		e.preventDefault();
		ok = '';
		error = '';
		try {
			const data = await api('/api/public/institution-request', {
				method: 'POST',
				body: {
					...form,
					latitud: form.latitud === '' ? null : Number(form.latitud),
					longitud: form.longitud === '' ? null : Number(form.longitud)
				}
			});
			ok = data.message + (data.request ? ` Folio solicitud: ${data.request.id}` : '');
		} catch (err) {
			error = err.message;
		}
	}
</script>

<div class="min-h-screen bg-gradient-to-b from-teal-50 to-slate-50 px-4 py-8">
	<div class="mx-auto max-w-xl">
		<a href="/login" class="text-sm text-[var(--brand)] underline">← Acceso interno</a>
		<h1 class="mt-3 text-2xl font-semibold text-[var(--brand)]">Registro de institución</h1>
		<p class="mt-1 text-sm text-slate-600">
			Formulario público. La información queda pendiente de revisión antes de incorporarse al catálogo.
		</p>

		<form class="card mt-4 grid gap-3" onsubmit={submit}>
			<label><span class="label">Nombre de la institución</span><input class="input" bind:value={form.nombre} required /></label>
			<div class="grid gap-3 sm:grid-cols-2">
				<label>
					<span class="label">Tipo</span>
					<select class="input" bind:value={form.tipo}>
						<option value="escuela">Escuela</option>
						<option value="asociacion">Asociación</option>
						<option value="otra">Otra</option>
					</select>
				</label>
				<label>
					<span class="label">Nivel</span>
					<select class="input" bind:value={form.nivelEducativo}>
						<option value="primaria">Primaria</option>
						<option value="secundaria">Secundaria</option>
						<option value="preparatoria">Preparatoria</option>
						<option value="mixto">Mixto</option>
					</select>
				</label>
			</div>
			<label><span class="label">Dirección</span><input class="input" bind:value={form.direccion} /></label>
			<div class="grid gap-3 sm:grid-cols-2">
				<label><span class="label">Ciudad</span><input class="input" bind:value={form.ciudad} /></label>
				<label><span class="label">Zona</span><input class="input" bind:value={form.zona} /></label>
			</div>
			<label><span class="label">Contacto</span><input class="input" bind:value={form.contactoNombre} required /></label>
			<label><span class="label">Email</span><input class="input" type="email" bind:value={form.contactoEmail} required /></label>
			<label><span class="label">Teléfono</span><input class="input" bind:value={form.contactoTelefono} /></label>
			<div class="grid gap-3 sm:grid-cols-2">
				<label><span class="label">Latitud (opcional)</span><input class="input" bind:value={form.latitud} /></label>
				<label><span class="label">Longitud (opcional)</span><input class="input" bind:value={form.longitud} /></label>
			</div>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" bind:checked={form.enviarSolicitud} />
				También enviar solicitud de visita
			</label>
			{#if form.enviarSolicitud}
				<label><span class="label">Cantidad estimada</span><input class="input" type="number" bind:value={form.cantidadEstimada} /></label>
				<label>
					<span class="label">Modalidad preferida</span>
					<select class="input" bind:value={form.modalidadPreferida}>
						<option value="patrocinada">Patrocinada</option>
						<option value="pagada">Pagada</option>
					</select>
				</label>
				<label><span class="label">Notas</span><textarea class="input" rows="2" bind:value={form.solicitudNotas}></textarea></label>
			{/if}
			{#if ok}<p class="text-sm text-green-700">{ok}</p>{/if}
			{#if error}<p class="text-sm text-red-600">{error}</p>{/if}
			<button class="btn">Enviar</button>
		</form>
	</div>
</div>
