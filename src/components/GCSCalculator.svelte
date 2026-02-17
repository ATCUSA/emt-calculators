<script>
	import { Calculator, Info, ExternalLink, AlertTriangle } from 'lucide-svelte';

	// Patient data
	let ageGroup = $state('adult'); // 'adult' | 'pediatric'
	let eyeResponse = $state('');
	let verbalResponse = $state('');
	let motorResponse = $state('');

	// Results
	let totalScore = $state(0);
	let interpretation = $state('');
	let severity = $state('');
	let clinicalNotes = $state([]);

	// Adult GCS Scoring
	const ADULT_GCS = {
		eye: {
			'4': 'Spontaneous eye opening',
			'3': 'Eye opening to verbal command',
			'2': 'Eye opening to pain',
			'1': 'No eye opening'
		},
		verbal: {
			'5': 'Oriented (knows who, where, when)',
			'4': 'Confused conversation',
			'3': 'Inappropriate words',
			'2': 'Incomprehensible sounds',
			'1': 'No verbal response'
		},
		motor: {
			'6': 'Obeys commands',
			'5': 'Localizes to pain',
			'4': 'Withdraws from pain',
			'3': 'Flexion to pain (decorticate)',
			'2': 'Extension to pain (decerebrate)',
			'1': 'No motor response'
		}
	};

	// Pediatric GCS (modified for <2 years)
	const PEDIATRIC_GCS = {
		eye: {
			'4': 'Spontaneous eye opening',
			'3': 'Eye opening to speech',
			'2': 'Eye opening to pain',
			'1': 'No eye opening'
		},
		verbal: {
			'5': 'Appropriate words/social smile, fixes & follows',
			'4': 'Cries but consolable',
			'3': 'Persistently irritable',
			'2': 'Restless, agitated',
			'1': 'No verbal response'
		},
		motor: {
			'6': 'Obeys commands/normal spontaneous movements',
			'5': 'Localizes to pain',
			'4': 'Withdraws from pain',
			'3': 'Flexion to pain (decorticate)',
			'2': 'Extension to pain (decerebrate)',
			'1': 'No motor response'
		}
	};

	// Calculate total score and interpretation
	function calculateGCS() {
		try {
		const eye = parseInt(eyeResponse) || 0;
		const verbal = parseInt(verbalResponse) || 0;
		const motor = parseInt(motorResponse) || 0;

		totalScore = eye + verbal + motor;

		// Clinical interpretation
		if (totalScore >= 13 && totalScore <= 15) {
			severity = 'mild';
			interpretation = 'Mild brain injury';
			clinicalNotes = [
				'Generally good prognosis',
				'Monitor for changes',
				'Consider cervical spine precautions',
				'Document baseline for trending'
			];
		} else if (totalScore >= 9 && totalScore <= 12) {
			severity = 'moderate';
			interpretation = 'Moderate brain injury';
			clinicalNotes = [
				'Requires close monitoring',
				'Consider advanced airway management',
				'Transport to trauma center if available',
				'Reassess frequently (every 15 minutes)'
			];
		} else if (totalScore >= 3 && totalScore <= 8) {
			severity = 'severe';
			interpretation = 'Severe brain injury';
			clinicalNotes = [
				'Critical condition - immediate transport',
				'Consider intubation (ALS intercept)',
				'Maintain SaO2 >95% and avoid hypotension',
				'Rapid transport to trauma center',
				'Consider helicopter transport if available'
			];
		} else {
			severity = '';
			interpretation = 'Please select all responses';
			clinicalNotes = [];
		}

		// Scroll to results section after calculation
		setTimeout(() => {
			const resultsElement = document.getElementById('gcs-results');
			if (resultsElement) {
				resultsElement.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		}, 100);
		} catch {
			totalScore = 0;
			interpretation = 'Calculation error - please try again';
			severity = '';
			clinicalNotes = [];
		}
	}

	// Reset function
	function reset() {
		ageGroup = 'adult';
		eyeResponse = '';
		verbalResponse = '';
		motorResponse = '';
		totalScore = 0;
		interpretation = '';
		severity = '';
		clinicalNotes = [];
	}

	// Get current GCS scale based on age group
	const currentGCS = $derived(ageGroup === 'pediatric' ? PEDIATRIC_GCS : ADULT_GCS);

	// Get severity styling
	function getSeverityStyle(severity) {
		switch (severity) {
			case 'mild':
				return 'panel-green panel-green-text border-l-4';
			case 'moderate':
				return 'panel-yellow panel-yellow-text border-l-4';
			case 'severe':
				return 'panel-red panel-red-text border-l-4';
			default:
				return 'theme-bg-tertiary theme-text-secondary border-l-4';
		}
	}
</script>

<div class="w-full max-w-4xl mx-auto p-6 theme-bg-secondary rounded-lg border theme-border-primary">
	<div class="flex items-center gap-3 mb-6">
		<Calculator class="w-8 h-8 theme-accent-primary" />
		<h1 class="text-3xl font-bold theme-text-primary">Glasgow Coma Scale Calculator</h1>
	</div>

	<div class="grid lg:grid-cols-2 gap-8">
		<!-- Input Section -->
		<div class="space-y-6">
			<h2 class="text-xl font-semibold theme-text-primary mb-4">Assessment</h2>

			<!-- Age Group Selection -->
			<div>
				<label class="block text-sm font-medium theme-text-primary mb-2">Patient Age Group</label>
				<select bind:value={ageGroup} class="w-full p-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary">
					<option value="adult">Adult/Child (>2 years)</option>
					<option value="pediatric">Pediatric (&lt;2 years)</option>
				</select>
				<div class="text-xs theme-text-muted mt-1">
					Pediatric scale uses age-appropriate responses for children under 2 years
				</div>
			</div>

			<!-- Eye Response -->
			<div>
				<label class="block text-sm font-medium theme-text-primary mb-3">Eye Opening Response</label>
				<div class="space-y-2">
					{#each Object.entries(currentGCS.eye) as [score, description]}
						<label class="flex items-start gap-3 p-3 border theme-border-primary rounded hover:theme-bg-tertiary cursor-pointer transition-colors">
							<input
								type="radio"
								bind:group={eyeResponse}
								value={score}
								class="mt-1 text-blue-600"
							/>
							<div>
								<div class="font-medium theme-text-primary">{score} points</div>
								<div class="text-sm theme-text-secondary">{description}</div>
							</div>
						</label>
					{/each}
				</div>
			</div>

			<!-- Verbal Response -->
			<div>
				<label class="block text-sm font-medium theme-text-primary mb-3">
					{ageGroup === 'pediatric' ? 'Verbal/Social Response' : 'Verbal Response'}
				</label>
				<div class="space-y-2">
					{#each Object.entries(currentGCS.verbal) as [score, description]}
						<label class="flex items-start gap-3 p-3 border theme-border-primary rounded hover:theme-bg-tertiary cursor-pointer transition-colors">
							<input
								type="radio"
								bind:group={verbalResponse}
								value={score}
								class="mt-1 text-blue-600"
							/>
							<div>
								<div class="font-medium theme-text-primary">{score} points</div>
								<div class="text-sm theme-text-secondary">{description}</div>
							</div>
						</label>
					{/each}
				</div>
			</div>

			<!-- Motor Response -->
			<div>
				<label class="block text-sm font-medium theme-text-primary mb-3">Motor Response</label>
				<div class="space-y-2">
					{#each Object.entries(currentGCS.motor) as [score, description]}
						<label class="flex items-start gap-3 p-3 border theme-border-primary rounded hover:theme-bg-tertiary cursor-pointer transition-colors">
							<input
								type="radio"
								bind:group={motorResponse}
								value={score}
								class="mt-1 text-blue-600"
							/>
							<div>
								<div class="font-medium theme-text-primary">{score} points</div>
								<div class="text-sm theme-text-secondary">{description}</div>
							</div>
						</label>
					{/each}
				</div>
			</div>

			<button
				onclick={() => calculateGCS()}
				class="w-full py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mb-3"
			>
				Calculate GCS Score
			</button>

			<button
				onclick={() => reset()}
				class="w-full py-3 min-h-[44px] theme-bg-tertiary hover:theme-bg-primary rounded-lg theme-text-primary transition-colors border theme-border-secondary"
			>
				Clear Assessment
			</button>
		</div>

		<!-- Results Section -->
		<div class="space-y-4" id="gcs-results" aria-live="polite" aria-atomic="true">
			<h2 class="text-xl font-semibold theme-text-primary mb-4">Results</h2>

			{#if totalScore > 0}
				<!-- Total Score -->
				<div class="p-6 {getSeverityStyle(severity)} rounded-lg border-l-4">
					<div class="text-center">
						<div class="text-sm font-medium mb-2">Glasgow Coma Scale Score</div>
						<div class="text-4xl font-bold mb-2">{totalScore}/15</div>
						<div class="text-lg font-semibold">{interpretation}</div>
					</div>
				</div>

				<!-- Score Breakdown -->
				<div class="p-4 theme-bg-tertiary rounded-lg">
					<div class="text-sm font-medium theme-text-primary mb-3">Score Breakdown</div>
					<div class="space-y-2 text-sm">
						<div class="flex justify-between">
							<span>Eye Opening:</span>
							<span class="font-medium">{eyeResponse}/4</span>
						</div>
						<div class="flex justify-between">
							<span>{ageGroup === 'pediatric' ? 'Verbal/Social:' : 'Verbal Response:'}</span>
							<span class="font-medium">{verbalResponse}/5</span>
						</div>
						<div class="flex justify-between">
							<span>Motor Response:</span>
							<span class="font-medium">{motorResponse}/6</span>
						</div>
						<hr class="theme-border-primary">
						<div class="flex justify-between font-semibold">
							<span>Total Score:</span>
							<span>{totalScore}/15</span>
						</div>
					</div>
				</div>

				<!-- Clinical Notes -->
				{#if clinicalNotes.length > 0}
					<div class="p-4 theme-bg-tertiary rounded-lg">
						<div class="flex items-start gap-2 mb-3">
							<Info class="w-5 h-5 theme-accent-primary flex-shrink-0 mt-0.5" />
							<div class="text-sm font-medium theme-text-primary">Clinical Considerations</div>
						</div>
						<ul class="space-y-2 text-sm theme-text-secondary">
							{#each clinicalNotes as note}
								<li class="flex items-start gap-2">
									<span class="w-1.5 h-1.5 rounded-full theme-bg-accent mt-2 flex-shrink-0"></span>
									<span>{note}</span>
								</li>
							{/each}
						</ul>
					</div>
				{/if}

				<!-- Severity Alert for Critical Patients -->
				{#if severity === 'severe'}
					<div class="p-4 panel-red border-l-4 rounded">
						<div class="flex items-start gap-2">
							<AlertTriangle class="w-5 h-5 panel-red-heading flex-shrink-0 mt-0.5" />
							<div>
								<div class="font-medium panel-red-text">Critical Patient Alert</div>
								<div class="text-sm panel-red-text mt-1">
									GCS ≤8 indicates severe brain injury. Consider immediate ALS intercept, airway management,
									and rapid transport to trauma center.
								</div>
							</div>
						</div>
					</div>
				{/if}
			{:else}
				<div class="p-4 theme-bg-tertiary rounded-lg text-center theme-text-muted">
					Complete the assessment to calculate GCS score and receive clinical guidance.
				</div>
			{/if}
		</div>
	</div>

	<!-- GCS Reference Chart -->
	<div class="mt-8 p-4 theme-bg-tertiary rounded-lg">
		<h3 class="text-lg font-semibold theme-text-primary mb-4">GCS Score Interpretation</h3>
		<div class="grid md:grid-cols-3 gap-4">
			<div class="p-4 panel-green border-l-4 rounded">
				<div class="font-semibold panel-green-text">Mild (13-15)</div>
				<div class="text-sm panel-green-text">Minor head injury, good prognosis</div>
			</div>
			<div class="p-4 panel-yellow border-l-4 rounded">
				<div class="font-semibold panel-yellow-text">Moderate (9-12)</div>
				<div class="text-sm panel-yellow-text">Requires close monitoring</div>
			</div>
			<div class="p-4 panel-red border-l-4 rounded">
				<div class="font-semibold panel-red-text">Severe (3-8)</div>
				<div class="text-sm panel-red-text">Critical, needs immediate care</div>
			</div>
		</div>
	</div>

	<!-- Medical Citations -->
	<div class="mt-8 p-4 border-t theme-border-primary">
		<h3 class="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
			<ExternalLink class="w-5 h-5" />
			Medical References
		</h3>
		<div class="space-y-3 text-sm">
			<div class="p-3 theme-bg-tertiary rounded">
				<div class="font-medium theme-text-primary">Original Glasgow Coma Scale</div>
				<div class="text-xs theme-text-secondary mt-1">
					Teasdale G, Jennett B. Assessment of coma and impaired consciousness. Lancet. 1974;2(7872):81-84.
				</div>
			</div>

			<div class="p-3 theme-bg-tertiary rounded">
				<div class="font-medium theme-text-primary">Pediatric GCS Modifications</div>
				<div class="text-xs theme-text-secondary mt-1">
					James HE. Neurologic evaluation and support in the child with an acute brain insult. Pediatr Ann. 1986;15(1):16-22.
				</div>
			</div>
		</div>

		<div class="mt-4 p-3 panel-blue border-l-4 rounded text-xs">
			<div class="font-medium panel-blue-heading">Clinical Note</div>
			<div class="panel-blue-text mt-1">
				GCS is a standardized assessment tool but should be used alongside other clinical indicators.
				Always consider mechanism of injury, vital signs, and patient history. Follow your local protocols
				for transport and treatment decisions.
			</div>
		</div>
	</div>
</div>