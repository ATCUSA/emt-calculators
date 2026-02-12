<script lang="ts">
  import { onMount } from 'svelte';

  let { variant = 'widget' }: { variant?: 'widget' | 'button' } = $props();

  onMount(() => {
    if (variant === 'widget') {
      // Load Buy Me a Coffee widget script
      const script = document.createElement('script');
      script.setAttribute('data-name', 'BMC-Widget');
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
      script.setAttribute('data-id', 'acole');
      script.setAttribute('data-description', 'Support me on Buy me a coffee!');
      script.setAttribute('data-message', 'Built by an EMT for EMTs. If this tool helps you care for patients, your support helps keep it updated and free for everyone. All support goes directly toward development, hosting, and supporting my family and community — not corporate profit.');
      script.setAttribute('data-color', '#5F7FFF');
      script.setAttribute('data-position', 'Right');
      script.setAttribute('data-x_margin', '18');
      script.setAttribute('data-y_margin', '18');

      document.body.appendChild(script);

      return () => {
        // Cleanup on component destroy
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
        // Also remove the widget if it exists
        const widget = document.querySelector('[data-name="BMC-Widget"]');
        if (widget && widget.parentNode) {
          widget.parentNode.removeChild(widget);
        }
      };
    }
  });
</script>

{#if variant === 'button'}
  <!-- Static button version for inline use -->
  <div class="flex justify-center">
    <a
      href="https://www.buymeacoffee.com/acole"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block hover:opacity-80 transition-opacity"
    >
      <img
        src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png"
        alt="Buy Me A Coffee or Buy Me Trauma Shears"
        class="h-[60px] w-[217px]"
      />
    </a>
  </div>
{/if}

{#if variant === 'widget'}
  <!-- Widget will be injected by the script -->
  <div id="bmc-widget-container"></div>
{/if}