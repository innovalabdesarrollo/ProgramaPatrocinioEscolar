<script>
	import { goto } from '$app/navigation';
	import { api, setSession } from '$lib/api.js';

	let email = $state('admin@museo.local');
	let password = $state('admin123');
	let error = $state('');
	let loading = $state(false);

	async function submit(e) {
		e.preventDefault();
		error = '';
		loading = true;
		try {
			const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
			setSession(data.token, data.user);
			goto('/');
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-teal-50 to-orange-50 px-4">
	<form class="card w-full max-w-md space-y-4" onsubmit={submit}>
		<div>
			<p class="text-sm font-medium text-[var(--brand-2)]">Programa de Patrocinio Escolar</p>
			<h1 class="text-2xl font-semibold text-[var(--brand)]">Mapa de Cobertura</h1>
			<p class="mt-1 text-sm text-slate-600">Acceso interno (sin Google). Sesión local.</p>
		</div>
		<label>
			<span class="label">Correo</span>
			<input class="input" type="email" bind:value={email} required />
		</label>
		<label>
			<span class="label">Contraseña</span>
			<input class="input" type="password" bind:value={password} required />
		</label>
		{#if error}
			<p class="text-sm text-red-600">{error}</p>
		{/if}
		<button class="btn w-full" disabled={loading}>{loading ? 'Entrando…' : 'Entrar'}</button>
		<p class="text-center text-xs text-slate-500">
			<a class="underline" href="/formulario">Formulario para instituciones</a>
			·
			<a class="underline" href="/consulta">Consultar solicitud</a>
		</p>
	</form>
</div>
