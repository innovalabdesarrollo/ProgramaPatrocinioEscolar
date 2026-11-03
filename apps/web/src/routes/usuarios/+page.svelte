<script>
	import { onMount } from 'svelte';
	import { api } from '$lib/api.js';

	let users = $state([]);
	let roles = $state({});
	let error = $state('');
	let form = $state({
		nombre: '',
		email: '',
		area: '',
		rol: 'visitas',
		password: ''
	});

	async function load() {
		error = '';
		try {
			users = await api('/api/users');
			roles = await api('/api/users/roles');
		} catch (err) {
			error = err.message;
		}
	}

	async function create(e) {
		e.preventDefault();
		try {
			await api('/api/users', { method: 'POST', body: form });
			form = { nombre: '', email: '', area: '', rol: 'visitas', password: '' };
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	async function toggle(u) {
		try {
			await api(`/api/users/${u.id}`, { method: 'PATCH', body: { activo: !u.activo } });
			await load();
		} catch (err) {
			error = err.message;
		}
	}

	onMount(load);
</script>

<div class="mb-4">
	<h1 class="text-xl font-semibold text-[var(--brand)]">Usuarios y roles</h1>
	<p class="text-sm text-slate-600">Cuentas internas · sin Google · activar/desactivar sin borrar historial</p>
</div>

{#if error}<p class="mb-2 text-sm text-red-600">{error}</p>{/if}

<form class="card mb-4 grid gap-3 sm:grid-cols-2" onsubmit={create}>
	<label><span class="label">Nombre</span><input class="input" bind:value={form.nombre} required /></label>
	<label><span class="label">Email</span><input class="input" type="email" bind:value={form.email} required /></label>
	<label><span class="label">Área</span><input class="input" bind:value={form.area} /></label>
	<label>
		<span class="label">Rol</span>
		<select class="input" bind:value={form.rol}>
			{#each Object.entries(roles) as [k, v]}
				<option value={k}>{v}</option>
			{/each}
		</select>
	</label>
	<label><span class="label">Contraseña</span><input class="input" type="password" bind:value={form.password} required /></label>
	<button class="btn self-end">Crear usuario</button>
</form>

<div class="card overflow-x-auto">
	<table class="w-full min-w-[560px] text-left text-sm">
		<thead class="text-xs uppercase text-slate-500">
			<tr>
				<th class="py-2">Nombre</th>
				<th>Email</th>
				<th>Rol</th>
				<th>Estado</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each users as u}
				<tr class="border-t border-slate-100">
					<td class="py-2">{u.nombre}</td>
					<td>{u.email}</td>
					<td>{roles[u.rol] || u.rol}</td>
					<td>{u.activo ? 'activo' : 'inactivo'}</td>
					<td>
						<button class="btn-secondary text-xs" onclick={() => toggle(u)}>
							{u.activo ? 'Desactivar' : 'Activar'}
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
