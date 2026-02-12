<script>
  import { Search } from 'lucide-svelte';
  import { searchTools } from '../data/tools.ts';

  // Props
  let { category = undefined, placeholder = "Search tools..." } = $props();

  // State
  let searchQuery = $state('');

  // Derived results based on search query and category
  let results = $derived(searchTools(searchQuery, category));

  // Get status badge styling
  function getStatusBadge(status) {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'coming-soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'planned':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }

  // Get level badge styling
  function getLevelBadge(level) {
    switch (level) {
      case 'EMT-B':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'EMT-A':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'AEMT':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Paramedic':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'All':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  }
</script>

<div class="w-full max-w-4xl mx-auto">
  <!-- Search Input -->
  <div class="relative mb-6">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search class="h-5 w-5 theme-text-muted" />
    </div>
    <input
      type="text"
      bind:value={searchQuery}
      placeholder={placeholder}
      class="w-full pl-10 pr-4 py-3 border theme-border-primary rounded-lg theme-bg-primary theme-text-primary focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
  </div>

  <!-- Results Count -->
  <div class="mb-4 text-sm theme-text-muted">
    {#if searchQuery}
      {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
    {:else}
      Showing all {category ? category + 's' : 'tools'} ({results.length})
    {/if}
  </div>

  <!-- Results Grid -->
  <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each results as tool}
      <div class="theme-bg-secondary rounded-lg border theme-border-primary p-4 {tool.status === 'active' ? 'hover:border-blue-500 cursor-pointer' : 'opacity-75'} transition-all">
        <!-- Header with badges -->
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <h3 class="font-semibold theme-text-primary text-lg mb-1">
              {#if tool.status === 'active' && tool.url}
                <a href={tool.url} class="hover:theme-accent-primary transition-colors">
                  {tool.name}
                </a>
              {:else}
                {tool.name}
              {/if}
            </h3>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm theme-text-secondary mb-3 leading-relaxed">
          {tool.description}
        </p>

        <!-- Badges -->
        <div class="flex flex-wrap gap-2">
          <!-- Status Badge -->
          <span class="text-xs px-2 py-1 rounded-full font-medium {getStatusBadge(tool.status)}">
            {tool.status === 'coming-soon' ? 'Coming Soon' : tool.status === 'planned' ? 'Planned' : 'Available'}
          </span>

          <!-- Level Badge -->
          <span class="text-xs px-2 py-1 rounded-full font-medium {getLevelBadge(tool.level)}">
            {tool.level}
          </span>

          <!-- Category Badge -->
          <span class="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {tool.subcategory}
          </span>
        </div>

        <!-- Tags -->
        {#if tool.tags.length > 0}
          <div class="mt-3 flex flex-wrap gap-1">
            {#each tool.tags.slice(0, 3) as tag}
              <span class="text-xs px-2 py-1 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded">
                {tag}
              </span>
            {/each}
            {#if tool.tags.length > 3}
              <span class="text-xs px-2 py-1 bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded">
                +{tool.tags.length - 3} more
              </span>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- No Results -->
  {#if results.length === 0 && searchQuery}
    <div class="text-center py-12">
      <Search class="w-16 h-16 theme-text-muted mx-auto mb-4 opacity-50" />
      <h3 class="text-lg font-medium theme-text-primary mb-2">No tools found</h3>
      <p class="theme-text-secondary">
        Try adjusting your search terms or browse all {category ? category + 's' : 'tools'}.
      </p>
    </div>
  {/if}
</div>