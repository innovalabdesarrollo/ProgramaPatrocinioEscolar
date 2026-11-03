<script>
	import { onMount } from 'svelte';
	import { api, getUser } from '$lib/api.js';

	let modules = $state([]);
	let roles = $state({});
	let matrix = $state({});
	let error = $state('');
	let ok = $state('');
	let saving = $state(false);
	const user = getUser();
	const canEdit = user?.rol === 'admin' || user?.rol === 'sistemas';

	async function load() {
		error = '';
		ok = '';
		try {
			const data = await api('/api/users/permissions');
			modules = data.modules || [];
			roles = data.roles || {};
			matrix = structuredClone(data.matrix || {});
		} catch (err) {
			error = err.message;
		}
	}

	onMount(load);

	function toggle(rol, modId, field) {
		if (!canEdit) return;
		if (!matrix[rol]) matrix[rol] = {};
		if (!matrix[rol][modId]) matrix[rol][modId] = { read: false, write: false };
		matrix[rol][modId][field] = !matrix[rol][modId][field];
		if (field === 'write' && matrix[rol][modId].write) matrix[rol][modId].read = true;
		if (field === 'read' && !matrix[rol][modId].read) matrix[rol][modId].write = false;
		matrix = { ...matrix };
	}

	async function save() {
		saving = true;
		error = '';
		ok = '';
		try {
			const data = await api('/api/users/permissions', {
				method: 'PUT',
				body: { matrix }
			});
			matrix = structuredClone(data.matrix || {});
			ok = 'Matriz guardada. El menú respeta lectura por rol.';
		} catch (err) {
			error = err.message;
		} finally {
			saving = false;
		}
	}

	async function resetDefaults() {
		if (!confirm('¿Restablecer la matriz a los valores por defecto?')) return;
		saving = true;
		error = '';
		ok = '';
		try {
			const data = await api('/api/users/permissions/reset', { method: 'POST', body: {} });
			matrix = structuredClone(data.matrix || {});
			ok = 'Matriz restablecida.';
		} catch (err) {
			error = err.message;
		} finally {
			saving = false;
		}
	}
</script>

<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
	<div>
		<h1 class="text-xl font-semibold text-[var(--brand)]">Matriz de permisos</h1>
		<p class="text-sm text-slate-600">
			Lectura / escritura por rol y módulo · editable por admin y sistemas
		</p>
	</div>
	{#if canEdit}
		<div class="flex flex-wrap gap-2">
			<button class="btn-secondary" disabled={saving} onclick={resetDefaults}>Restablecer</button>
			<button class="btn" disabled={saving} onclick={save}>{saving ? 'Guardando…' : 'Guardar'}</button>
		</div>
	{/if}
</div>

{#if error}<p class="mb-3 text-sm text-red-600">{error}</p>{/if}
{#if ok}<p class="mb-3 text-sm text-emerald-700">{ok}</p>{/if}

<div class="card overflow-x-auto">
	<table class="w-full min-w-[720px] text-left text-sm">
		<thead class="text-xs uppercase text-slate-500">
			<tr>
				<th class="py-2">Módulo</th>
				{#each Object.entries(roles) as [rol, label]}
					<th class="px-1 text-center" title={label}>{rol}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each modules as m}
				<tr class="border-t border-slate-100">
					<td class="py-2 font-medium">{m.label}</td>
					{#each Object.keys(roles) as rol}
						<td class="px-1 py-2 text-center">
							<label class="mr-1 inline-flex items-center gap-0.5 text-[10px] text-slate-500">
								<input
									type="checkbox"
									checked={matrix[rol]?.[m.id]?.read}
									disabled={!canEdit}
									onchange={() => toggle(rol, m.id, 'read')}
								/>
								L
							</label>
							<label class="inline-flex items-center gap-0.5 text-[10px] text-slate-500">
								<input
									type="checkbox"
									checked={matrix[rol]?.[m.id]?.write}
									disabled={!canEdit}
									onchange={() => toggle(rol, m.id, 'write')}
								/>
								E
							</label>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<p class="mt-2 text-xs text-slate-500">L = lectura (menú / consulta) · E = escritura (crear / editar)</p>
</div>
