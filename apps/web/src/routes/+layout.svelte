<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { getUser, clearSession, api } from '$lib/api.js';

	let { children } = $props();
	let user = $state(null);
	let menuOpen = $state(false);

	const publicPaths = ['/login', '/formulario', '/consulta'];
	const ALL_LINKS = [
		{ href: '/', label: 'Tablero', module: 'tablero' },
		{ href: '/instituciones', label: 'Instituciones', module: 'instituciones' },
		{ href: '/solicitudes', label: 'Solicitudes', module: 'solicitudes' },
		{ href: '/visitas', label: 'Visitas', module: 'visitas' },
		{ href: '/patrocinio', label: 'Patrocinio', module: 'patrocinio' },
		{ href: '/mapa', label: 'Mapa', module: 'mapa' },
		{ href: '/usuarios', label: 'Usuarios', module: 'usuarios' },
		{ href: '/bitacora', label: 'Bitácora', module: 'bitacora' },
		{ href: '/permisos', label: 'Permisos', module: 'permisos' }
	];
	let links = $state([...ALL_LINKS]);

	onMount(async () => {
		user = getUser();
		const path = $page.url.pathname;
		if (!publicPaths.includes(path) && !user) {
			goto('/login');
			return;
		}
		if (!user) return;
		try {
			const perms = await api('/api/users/permissions');
			const row = perms.matrix?.[user.rol] || {};
			links = ALL_LINKS.filter((l) => row[l.module]?.read);
		} catch {
			/* menú completo si falla la matriz */
		}
	});

	async function logout() {
		try {
			await api('/api/auth/logout', { method: 'POST' });
		} catch {
			/* ignore */
		}
		clearSession();
		user = null;
		goto('/login');
	}
</script>

{#if publicPaths.includes($page.url.pathname)}
	{@render children()}
{:else}
	<div class="min-h-screen">
		<header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
			<div class="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
				<a href="/" class="text-lg font-semibold text-[var(--brand)]">Mapa Cobertura</a>
				<button class="btn-secondary md:hidden" onclick={() => (menuOpen = !menuOpen)}>Menú</button>
				<nav class="hidden flex-wrap items-center gap-1 md:flex">
					{#each links as l}
						<a
							href={l.href}
							class="rounded-lg px-2.5 py-1.5 text-sm {$page.url.pathname === l.href
								? 'bg-slate-100 font-medium text-[var(--brand)]'
								: 'text-slate-600 hover:bg-slate-50'}"
						>
							{l.label}
						</a>
					{/each}
				</nav>
				<div class="hidden items-center gap-2 md:flex">
					<span class="text-xs text-slate-500">{user?.nombre} · {user?.rol}</span>
					<button class="btn-secondary" onclick={logout}>Salir</button>
				</div>
			</div>
			{#if menuOpen}
				<nav class="border-t border-slate-100 px-4 py-2 md:hidden">
					{#each links as l}
						<a
							href={l.href}
							class="block rounded-lg px-2 py-2 text-sm"
							onclick={() => (menuOpen = false)}>{l.label}</a
						>
					{/each}
					<button class="mt-2 w-full btn-secondary" onclick={logout}>Salir</button>
				</nav>
			{/if}
		</header>
		<main class="mx-auto max-w-7xl px-4 py-5">
			{@render children()}
		</main>
	</div>
{/if}
