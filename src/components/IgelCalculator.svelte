<script>
	import { Calculator, Info, ExternalLink } from 'lucide-svelte';

	// Patient data
	let height = $state('');
	let heightFeet = $state('');
	let heightInches = $state('');
	let heightUnit = $state('cm');
	let gender = $state('');
	let ageGroup = $state('adult');

	// Results
	let idealWeight = $state(0);
	let igelSize = $state('');
	let sizeDescription = $state('');
	let igelColor = $state('');
	let warnings = $state([]);

	// i-gel sizing chart based on manufacturer guidelines (Intersurgical)
	const IGEL_SIZING = {
		'1': { weightRange: '2-5 kg', description: 'Neonate', color: 'Pink' },
		'1.5': { weightRange: '5-12 kg', description: 'Infant', color: 'Light Blue' },
		'2': { weightRange: '10-25 kg', description: 'Small Pediatric', color: 'Grey' },
		'2.5': { weightRange: '25-35 kg', description: 'Large Pediatric', color: 'White' },
		'3': { weightRange: '30-60 kg', description: 'Small Adult', color: 'Yellow' },
		'4': { weightRange: '50-90 kg', description: 'Medium Adult', color: 'Green' },
		'5': { weightRange: '90+ kg', description: 'Large Adult', color: 'Orange' }
	};

	// Calculate ideal body weight based on height and gender
	function calculateIdealWeight(heightCm, gender) {
		// Using Devine formula (widely used in medical calculations)
		// Male: 50 kg + 2.3 kg × (height in inches - 60)
		// Female: 45.5 kg + 2.3 kg × (height in inches - 60)

		const heightInches = heightCm / 2.54;

		if (heightInches <= 60) {
			// For very short individuals, use minimum base weight
			return gender === 'male' ? 50 : 45.5;
		}

		const baseWeight = gender === 'male' ? 50 : 45.5;
		return baseWeight + 2.3 * (heightInches - 60);
	}

	// Determine appropriate i-gel size based on weight
	function determineIgelSize(weight) {
		if (weight < 2) return {
			size: 'Too Small',
			description: 'Consider alternative airway',
			color: '',
			warnings: ['Patient may be too small for i-gel']
		};

		// Handle overlap areas with dual size recommendations
		if (weight <= 5) return {
			size: '1',
			description: IGEL_SIZING['1'].description,
			color: IGEL_SIZING['1'].color,
			warnings: weight === 5 ? ['Consider size 1 or 1.5 - assess patient anatomy'] : []
		};

		if (weight > 5 && weight <= 10) return {
			size: '1.5',
			description: IGEL_SIZING['1.5'].description,
			color: IGEL_SIZING['1.5'].color,
			warnings: weight === 10 ? ['Consider size 1.5 or 2 - assess patient anatomy'] : []
		};

		if (weight > 10 && weight <= 12) return {
			size: '1.5 or 2',
			description: 'Infant/Small Pediatric overlap',
			color: `${IGEL_SIZING['1.5'].color} or ${IGEL_SIZING['2'].color}`,
			warnings: ['Consider both sizes - assess patient anatomy and neck size']
		};

		if (weight > 12 && weight <= 25) return {
			size: '2',
			description: IGEL_SIZING['2'].description,
			color: IGEL_SIZING['2'].color,
			warnings: weight === 25 ? ['Consider size 2 or 2.5 - assess patient anatomy'] : []
		};

		if (weight > 25 && weight <= 30) return {
			size: '2.5 or 3',
			description: 'Large Pediatric/Small Adult overlap',
			color: `${IGEL_SIZING['2.5'].color} or ${IGEL_SIZING['3'].color}`,
			warnings: ['Consider both sizes - assess patient anatomy and age group']
		};

		if (weight > 30 && weight <= 35) return {
			size: '2.5 or 3',
			description: 'Large Pediatric/Small Adult overlap',
			color: `${IGEL_SIZING['2.5'].color} or ${IGEL_SIZING['3'].color}`,
			warnings: ['Consider both sizes - assess patient anatomy and age group']
		};

		if (weight > 35 && weight <= 50) return {
			size: '3',
			description: IGEL_SIZING['3'].description,
			color: IGEL_SIZING['3'].color,
			warnings: weight === 50 ? ['Consider size 3 or 4 - assess patient anatomy'] : []
		};

		if (weight > 50 && weight <= 60) return {
			size: '3 or 4',
			description: 'Small/Medium Adult overlap',
			color: `${IGEL_SIZING['3'].color} or ${IGEL_SIZING['4'].color}`,
			warnings: ['Consider both sizes - assess patient anatomy and neck size']
		};

		if (weight > 60 && weight <= 90) return {
			size: '4',
			description: IGEL_SIZING['4'].description,
			color: IGEL_SIZING['4'].color,
			warnings: weight === 90 ? ['Consider size 4 or 5 - assess patient anatomy'] : []
		};

		if (weight > 90) return {
			size: '5',
			description: IGEL_SIZING['5'].description,
			color: IGEL_SIZING['5'].color,
			warnings: []
		};

		return {
			size: 'Unknown',
			description: 'Unable to determine',
			color: '',
			warnings: ['Please verify sizing manually']
		};
	}

	// Calculate function - only runs when explicitly called
	function calculateSize() {
		try {
		// Check required fields based on height unit
		if (!gender) {
			warnings = ['Please select gender'];
			return;
		}

		let heightCm = 0;
		warnings = [];

		// Handle different height input methods
		if (heightUnit === 'ft') {
			if (!heightFeet) {
				warnings = ['Please enter feet'];
				return;
			}
			const feet = parseFloat(heightFeet);
			const inches = parseFloat(heightInches) || 0; // inches is optional

			if (isNaN(feet)) {
				warnings = ['Please enter a valid number for feet'];
				return;
			}
			if (heightInches && isNaN(inches)) {
				warnings = ['Please enter a valid number for inches'];
				return;
			}

			// Convert to cm: (feet * 12 + inches) * 2.54
			heightCm = (feet * 12 + inches) * 2.54;
		} else {
			if (!height) {
				warnings = ['Please enter height'];
				return;
			}
			heightCm = parseFloat(height);
			if (isNaN(heightCm)) {
				warnings = ['Please enter a valid height'];
				return;
			}

			if (heightUnit === 'in') {
				heightCm = heightCm * 2.54;
			}
		}

		// Validate height range
		if (heightCm < 50 || heightCm > 250) {
			warnings = [...warnings, 'Height seems outside normal range - please verify'];
		}

		// Calculate ideal weight
		if (ageGroup === 'pediatric' && heightCm > 0) {
			// For pediatric patients, use simplified weight estimation
			// Weight (kg) = (Age in years + 4) × 2 for ages 1-10
			// Or use height-based estimation for very young patients
			if (heightCm < 100) {
				idealWeight = Math.max(2, heightCm / 10); // Rough estimation for infants
			} else {
				idealWeight = calculateIdealWeight(heightCm, gender);
			}
		} else {
			idealWeight = calculateIdealWeight(heightCm, gender);
		}

		// Determine i-gel size
		const sizing = determineIgelSize(idealWeight);
		igelSize = sizing.size;
		sizeDescription = sizing.description;
		igelColor = sizing.color;
		warnings = [...warnings, ...sizing.warnings];

		// Add additional clinical warnings
		if (ageGroup === 'pediatric' && idealWeight > 35) {
			warnings = [...warnings, 'Large pediatric patient - consider adult sizing'];
		}
		} catch {
			warnings = ['Calculation error - please verify inputs and try again'];
		}
	}

	// Get color style for i-gel sizes
	function getColorStyle(colorName) {
		const colorMap = {
			'Pink': 'bg-pink-300 border-pink-400',
			'Light Blue': 'bg-blue-300 border-blue-400',
			'Grey': 'bg-gray-400 border-gray-500',
			'White': 'bg-white border-gray-400',
			'Yellow': 'bg-yellow-300 border-yellow-400',
			'Green': 'bg-green-300 border-green-400',
			'Orange': 'bg-orange-300 border-orange-400'
		};
		return colorMap[colorName] || 'bg-gray-200 border-gray-300';
	}

	// Parse color information for display (handles "Color1 or Color2" format)
	function parseColors(colorString) {
		if (!colorString) return [];
		if (colorString.includes(' or ')) {
			return colorString.split(' or ').map(c => c.trim());
		}
		return [colorString];
	}

	// Reset function
	function reset() {
		height = '';
		heightFeet = '';
		heightInches = '';
		heightUnit = 'cm';
		gender = '';
		ageGroup = 'adult';
		idealWeight = 0;
		igelSize = '';
		sizeDescription = '';
		igelColor = '';
		warnings = [];
	}
</script>

<div class="w-full max-w-4xl mx-auto p-6 theme-bg-secondary rounded-lg border theme-border-primary">
	<div class="flex items-center gap-3 mb-6">
		<Calculator class="w-8 h-8 theme-accent-primary" />
		<div>
			<h1 class="text-2xl font-bold theme-text-primary">i-gel Size Calculator</h1>
			<p class="text-sm theme-text-secondary">Determine appropriate i-gel size based on patient height and estimated weight</p>
		</div>
	</div>

	<!-- Input Section -->
	<div class="grid md:grid-cols-2 gap-6 mb-6">
		<div class="space-y-4">
			<h2 class="text-lg font-semibold theme-text-primary mb-3">Patient Information</h2>

			<!-- Age Group -->
			<div>
				<label class="block text-sm font-medium theme-text-primary mb-2">Patient Category</label>
				<select bind:value={ageGroup} class="w-full p-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary">
					<option value="adult">Adult</option>
					<option value="pediatric">Pediatric</option>
				</select>
			</div>

			<!-- Gender -->
			<div>
				<label class="block text-sm font-medium theme-text-primary mb-2">Gender</label>
				<select bind:value={gender} class="w-full p-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary">
					<option value="">Select gender</option>
					<option value="male">Male</option>
					<option value="female">Female</option>
				</select>
			</div>

			<!-- Height -->
			<div>
				<label class="block text-sm font-medium theme-text-primary mb-2">Height</label>
				<div class="mb-2">
					<select bind:value={heightUnit} class="w-full p-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary">
						<option value="cm">Centimeters (cm)</option>
						<option value="ft">Feet and Inches</option>
						<option value="in">Inches</option>
					</select>
				</div>

				{#if heightUnit === 'ft'}
					<div class="flex gap-2">
						<div class="flex-1">
							<input
								type="number"
								bind:value={heightFeet}
								placeholder="Feet"
								min="0"
								max="9"
								class="w-full p-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary"
							/>
							<div class="text-xs theme-text-muted mt-1">feet</div>
						</div>
						<div class="flex-1">
							<input
								type="number"
								bind:value={heightInches}
								placeholder="Inches"
								min="0"
								max="11"
								step="0.5"
								class="w-full p-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary"
							/>
							<div class="text-xs theme-text-muted mt-1">inches (optional)</div>
						</div>
					</div>
				{:else}
					<input
						type="number"
						bind:value={height}
						placeholder={heightUnit === 'cm' ? 'Enter height in cm' : 'Enter height in inches'}
						step="0.1"
						min="0"
						class="w-full p-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary"
					/>
				{/if}
			</div>

			<button
				onclick={calculateSize}
				class="w-full py-3 min-h-[44px] bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mb-3"
			>
				Calculate i-gel Size
			</button>

			<button
				onclick={reset}
				class="w-full py-3 min-h-[44px] theme-bg-tertiary hover:theme-bg-primary rounded-lg theme-text-primary transition-colors border theme-border-secondary"
			>
				Clear All
			</button>
		</div>

		<div class="space-y-4" aria-live="polite" aria-atomic="true">
			<h2 class="text-lg font-semibold theme-text-primary mb-3">Results</h2>

			<!-- Show input validation warnings -->
			{#if warnings.length > 0 && !igelSize}
				<div class="p-4 panel-yellow border-l-4 rounded">
					<div class="flex items-start gap-2">
						<Info class="w-5 h-5 panel-yellow-heading flex-shrink-0 mt-0.5" />
						<div>
							<div class="text-sm font-medium panel-yellow-heading">Input Required</div>
							{#each warnings as warning}
								<div class="text-xs panel-yellow-text mt-1">• {warning}</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			{#if igelSize && idealWeight > 0}
				<!-- Ideal Weight -->
				<div class="p-4 theme-bg-tertiary rounded-lg">
					<div class="text-sm theme-text-secondary">Estimated Ideal Weight</div>
					<div class="text-2xl font-bold theme-accent-primary">{idealWeight.toFixed(1)} kg</div>
					<div class="text-xs theme-text-muted mt-1">Based on Devine formula</div>
				</div>

				<!-- i-gel Size -->
				<div class="p-4 theme-bg-tertiary rounded-lg">
					<div class="text-sm theme-text-secondary">Recommended i-gel Size</div>
					<div class="text-3xl font-bold theme-accent-primary mb-2">Size {igelSize}</div>
					<div class="text-sm theme-text-primary mb-2">{sizeDescription}</div>

					{#if igelColor}
						<!-- Color display with visual blocks -->
						<div class="flex items-center gap-2 mb-2">
							<span class="text-sm font-medium theme-text-primary">Color:</span>
							<div class="flex items-center gap-2">
								{#each parseColors(igelColor) as color}
									<div class="flex items-center gap-2">
										<div class="w-6 h-6 rounded border-2 {getColorStyle(color)}"></div>
										<span class="text-sm font-bold">{color}</span>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if IGEL_SIZING[igelSize]}
						<div class="text-xs theme-text-muted mt-1">
							Weight range: {IGEL_SIZING[igelSize].weightRange}
						</div>
					{/if}
				</div>

				<!-- Warnings -->
				{#if warnings.length > 0}
					<div class="p-4 panel-yellow border-l-4 rounded">
						<div class="flex items-start gap-2">
							<Info class="w-5 h-5 panel-yellow-heading flex-shrink-0 mt-0.5" />
							<div>
								<div class="text-sm font-medium panel-yellow-heading">Clinical Notes</div>
								{#each warnings as warning}
									<div class="text-xs panel-yellow-text mt-1">• {warning}</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			{:else}
				<div class="p-4 theme-bg-tertiary rounded-lg text-center theme-text-muted">
					<Calculator class="w-12 h-12 mx-auto mb-2 opacity-50" />
					<p>Enter patient information to calculate i-gel size</p>
				</div>
			{/if}
		</div>
	</div>

	<!-- i-gel Size Reference Chart -->
	<div class="mt-8 p-4 theme-bg-tertiary rounded-lg">
		<h3 class="text-lg font-semibold theme-text-primary mb-4">i-gel Size Reference Chart</h3>
		<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
			{#each Object.entries(IGEL_SIZING) as [size, info]}
				<div class="p-3 bg-white dark:bg-gray-700 rounded border">
					<div class="flex items-center gap-3 mb-2">
						<div class="w-6 h-6 rounded border-2 {getColorStyle(info.color)}"></div>
						<div class="font-bold text-lg">Size {size}</div>
					</div>
					<div class="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{info.color}</div>
					<div class="text-sm text-gray-600 dark:text-gray-300 mb-1">{info.weightRange}</div>
					<div class="text-xs text-gray-500 dark:text-gray-400">{info.description}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Medical Citations -->
	<div class="mt-8 p-4 border-t theme-border-primary">
		<h3 class="text-lg font-semibold theme-text-primary mb-4 flex items-center gap-2">
			<ExternalLink class="w-5 h-5" />
			Medical References & Citations
		</h3>
		<div class="space-y-3 text-sm">
			<div class="p-3 theme-bg-tertiary rounded">
				<div class="font-medium theme-text-primary">i-gel Sizing Guidelines & Color Chart</div>
				<div class="text-xs theme-text-secondary mt-1">
					Intersurgical Ltd. i-gel supraglottic airway – anaesthesia. Official product page with size, color, and weight specifications.
				</div>
				<a href="https://www.intersurgical.com/info/igel-anaesthesia" target="_blank" rel="noopener noreferrer"
				   class="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-1 inline-flex items-center gap-1">
					Manufacturer Sizing Chart <ExternalLink class="w-3 h-3" />
				</a>
			</div>

			<div class="p-3 theme-bg-tertiary rounded">
				<div class="font-medium theme-text-primary">i-gel Product Information</div>
				<div class="text-xs theme-text-secondary mt-1">
					Intersurgical Ltd. General product page and downloadable information sheets covering adult and pediatric range (2–90+ kg).
				</div>
				<a href="https://www.intersurgical.com/info/igel" target="_blank" rel="noopener noreferrer"
				   class="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-1 inline-flex items-center gap-1">
					General Product Info <ExternalLink class="w-3 h-3" />
				</a>
			</div>

			<div class="p-3 theme-bg-tertiary rounded">
				<div class="font-medium theme-text-primary">Ideal Body Weight Formula</div>
				<div class="text-xs theme-text-secondary mt-1">
					Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650-655. Historical formula: Male: 50 kg + 2.3 × (height - 60 inches); Female: 45.5 kg + 2.3 × (height - 60 inches).
				</div>
				<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4841935/" target="_blank" rel="noopener noreferrer"
				   class="text-blue-600 dark:text-blue-400 hover:underline text-xs mt-1 inline-flex items-center gap-1">
					PMCID: PMC4841935 <ExternalLink class="w-3 h-3" />
				</a>
			</div>
		</div>

		<div class="mt-4 p-3 panel-blue border-l-4 rounded text-xs">
			<div class="font-medium panel-blue-heading">Clinical Note</div>
			<div class="panel-blue-text mt-1">
				This calculator provides estimated sizing based on manufacturer guidelines and historical weight estimation formulas.
				The Devine formula (1974) serves as a first-level anthropometric screen but has inherent limitations in assessing body composition.
				Final size selection should be based on clinical assessment per manufacturer and regional EMS user guides.
				Always consider individual patient anatomy, clinical presentation, and follow your local protocols.
				Have alternative airway devices readily available.
			</div>
		</div>
	</div>
</div>