<!--
  @component ContentSection - Full-width section with heading + body, used for clinical notes/evidence.
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

<div class="panel-{color} border rounded-lg p-6">
  <h3 class="text-lg font-semibold mb-3 panel-{color}-heading">{title}</h3>
  <div class="panel-{color}-text text-sm">
    {@render children()}
  </div>
</div>
