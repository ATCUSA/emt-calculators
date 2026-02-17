<script>
	import { onMount, onDestroy } from 'svelte';
	import { Download, X, RefreshCw } from 'lucide-svelte';
	import { APP_CONFIG } from '../config/version';

	let showUpdate = $state(false);
	let updateAvailable = $state(false);
	let newWorker = $state(null);
	let isUpdating = $state(false);
	let versionInfoTimer = $state(null);
	let messageHandler = null;

	onMount(() => {
		if (!('serviceWorker' in navigator)) return;

		messageHandler = (event) => {
			if (event.data?.type === 'UPDATE_AVAILABLE') {
				showUpdate = true;
				updateAvailable = true;
				newWorker = event.data.worker;
			}
		};
		navigator.serviceWorker.addEventListener('message', messageHandler);

		// Check current version against stored version
		const storedVersion = localStorage.getItem('app-version');
		const currentVersion = APP_CONFIG.version;

		if (storedVersion && storedVersion !== currentVersion) {
			showVersionInfo();
		}

		// Store current version
		localStorage.setItem('app-version', currentVersion);
	});

	onDestroy(() => {
		if (messageHandler && typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
			navigator.serviceWorker.removeEventListener('message', messageHandler);
		}
		if (versionInfoTimer !== null) clearTimeout(versionInfoTimer);
	});

	function showVersionInfo() {
		// Show changelog for new version
		versionInfoTimer = setTimeout(() => {
			if (!localStorage.getItem('changelog-seen-' + APP_CONFIG.version)) {
				showUpdate = true;
				updateAvailable = false; // This is a version info, not an update
			}
		}, 2000);
	}

	async function applyUpdate() {
		if (!newWorker) return;

		isUpdating = true;

		try {
			// Tell service worker to skip waiting
			newWorker.postMessage({ type: 'SKIP_WAITING' });

			// Wait for the new service worker to take control
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				window.location.reload();
			}, { once: true });
		} catch (error) {
			console.error('Failed to apply update:', error);
			isUpdating = false;
		}
	}

	function dismissUpdate() {
		showUpdate = false;
		if (!updateAvailable) {
			// Mark changelog as seen
			localStorage.setItem('changelog-seen-' + APP_CONFIG.version, 'true');
		}
	}

	// Expose global function for service worker to call
	if (typeof window !== 'undefined') {
		window.showUpdateNotification = (worker) => {
			newWorker = worker;
			showUpdate = true;
			updateAvailable = true;
		};
	}
</script>

{#if showUpdate}
	<div class="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto">
		<div class="bg-blue-600 text-white p-4 rounded-lg shadow-lg backdrop-blur-sm">
			<div class="flex items-start gap-3">
				{#if updateAvailable}
					<Download class="w-6 h-6 flex-shrink-0 mt-0.5" />
				{:else}
					<RefreshCw class="w-6 h-6 flex-shrink-0 mt-0.5" />
				{/if}
				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium">
						{#if updateAvailable}
							🚀 Update Available!
						{:else}
							✨ What's New in v{APP_CONFIG.version}
						{/if}
					</div>
					<div class="mt-1 text-xs text-blue-100">
						{#if updateAvailable}
							<p>A new version of EMT Calculator Tools is ready.</p>
						{:else}
							<ul class="list-disc list-inside space-y-1 mt-2">
								{#each APP_CONFIG.changelog.find(c => c.version === APP_CONFIG.version)?.changes || [] as feature}
									<li class="text-xs">{feature}</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
				<button
					onclick={dismissUpdate}
					class="flex-shrink-0 p-1 rounded-full hover:bg-blue-700 transition-colors"
					aria-label="Dismiss notification"
				>
					<X class="w-4 h-4" />
				</button>
			</div>

			{#if updateAvailable}
				<div class="mt-3 flex gap-2">
					<button
						onclick={applyUpdate}
						disabled={isUpdating}
						class="flex-1 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-200 disabled:text-gray-500 px-4 py-3 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
					>
						{#if isUpdating}
							<RefreshCw class="w-4 h-4 animate-spin" />
							Updating...
						{:else}
							<Download class="w-4 h-4" />
							Update Now
						{/if}
					</button>
					<button
						onclick={dismissUpdate}
						class="px-4 py-3 rounded text-sm font-medium text-blue-200 hover:text-white transition-colors"
					>
						Later
					</button>
				</div>
			{:else}
				<div class="mt-3 flex justify-end">
					<button
						onclick={dismissUpdate}
						class="px-4 py-3 rounded text-sm font-medium bg-blue-700 hover:bg-blue-800 transition-colors"
					>
						Got it!
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
