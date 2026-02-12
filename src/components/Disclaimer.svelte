<script>
	import { AlertTriangle, X } from 'lucide-svelte';

	let showDisclaimer = $state(true);

	// Check if user has already dismissed disclaimer
	if (typeof localStorage !== 'undefined') {
		const dismissed = localStorage.getItem('disclaimer-dismissed');
		showDisclaimer = !dismissed;
	}

	function dismissDisclaimer() {
		showDisclaimer = false;
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem('disclaimer-dismissed', 'true');
		}
	}
</script>

{#if showDisclaimer}
	<div class="fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto">
		<div class="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg backdrop-blur-sm">
			<div class="flex items-start gap-3">
				<AlertTriangle class="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
				<div class="flex-1 min-w-0">
					<div class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
						⚠️ Medical Disclaimer
					</div>
					<div class="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
						<p class="mb-2">
							<strong>This tool is for educational purposes only</strong> and is a work in progress.
							It is <strong>NOT intended for production medical use</strong>.
						</p>
						<p class="mb-2">
							• Not 100% accurate - always verify calculations<br>
							• Not a substitute for proper medical training<br>
							• Follow your local protocols and medical director guidelines<br>
							• Use clinical judgment in all medical situations
						</p>
						<p class="text-xs opacity-90">
							By using this app, you acknowledge this is an educational tool and not medical advice.
						</p>
					</div>
				</div>
				<button
					onclick={dismissDisclaimer}
					class="flex-shrink-0 p-1 rounded-full hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
					aria-label="Dismiss disclaimer"
				>
					<X class="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Ensure the disclaimer is above other content */
	:global(.disclaimer-overlay) {
		z-index: 9999;
	}
</style>