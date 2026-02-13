<!--
  @component AlertBox - Left-border alert with optional icon, used for warnings/status.
  Uses the panel-{color} CSS classes from global.css for theme-aware coloring.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    color: 'red' | 'yellow' | 'green' | 'blue' | 'purple' | 'orange';
    title?: string;
    children: Snippet;
  }

  let { color, title, children }: Props = $props();
</script>

<div class="panel-{color} border-l-4 rounded p-4">
  {#if title}
    <div class="panel-{color}-heading font-medium mb-1">{title}</div>
  {/if}
  <div class="panel-{color}-text text-sm">
    {@render children()}
  </div>
</div>
