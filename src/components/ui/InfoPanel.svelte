<!--
  @component InfoPanel - Bordered card with title + content, used in grid layouts.
  Uses the panel-{color} CSS classes from global.css for theme-aware coloring.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange';
    title: string;
    children: Snippet;
  }

  let { color, title, children }: Props = $props();
</script>

<div class="panel-{color} border rounded-lg p-4">
  <h4 class="panel-{color}-heading font-medium mb-2">{title}</h4>
  <div class="panel-{color}-text text-xs space-y-1">
    {@render children()}
  </div>
</div>
