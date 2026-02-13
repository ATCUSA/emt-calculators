<script lang="ts">
  import { Sun, Moon, Monitor } from 'lucide-svelte';
  import { onMount } from 'svelte';

  type Theme = 'light' | 'dark' | 'auto';

  let currentTheme = $state<Theme>('dark');
  let mounted = $state(false);

  onMount(() => {
    // Get saved theme or default to 'auto'
    const savedTheme = localStorage.getItem('theme') as Theme;
    currentTheme = savedTheme || 'auto';
    applyTheme(currentTheme);
    mounted = true;
  });

  function applyTheme(theme: Theme) {
    const html = document.documentElement;

    if (theme === 'auto') {
      html.removeAttribute('data-theme');
      html.setAttribute('data-theme', 'auto');
    } else {
      html.setAttribute('data-theme', theme);
    }

    localStorage.setItem('theme', theme);
    currentTheme = theme;
  }

  function toggleTheme() {
    const themes: Theme[] = ['dark', 'light', 'auto'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(nextTheme);
  }

  const themeConfig = {
    dark: { icon: Moon, label: 'Dark' },
    light: { icon: Sun, label: 'Light' },
    auto: { icon: Monitor, label: 'Auto' }
  };

  const CurrentIcon = $derived(themeConfig[currentTheme].icon);
</script>

{#if mounted}
  <button
    onclick={toggleTheme}
    class="theme-toggle flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm"
    title="Toggle theme: {themeConfig[currentTheme].label}"
  >
    <CurrentIcon size={16} />
    <span class="hidden sm:inline">{themeConfig[currentTheme].label}</span>
  </button>
{/if}

<style>
  .theme-toggle {
    background-color: var(--bg-tertiary);
    border-color: var(--border-secondary);
    color: var(--text-secondary);
  }

  .theme-toggle:hover {
    background-color: var(--border-secondary);
    border-color: var(--text-muted);
  }
</style>
