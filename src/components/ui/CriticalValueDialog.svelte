<script lang="ts">
  import { AlertTriangle } from 'lucide-svelte';

  interface Props {
    open: boolean;
    title: string;
    message: string;
    value: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  let { open, title, message, value, onConfirm, onCancel }: Props = $props();

  let dialogEl: HTMLDialogElement | undefined = $state(undefined);

  $effect(() => {
    if (!dialogEl) return;
    if (open && !dialogEl.open) {
      dialogEl.showModal();
    } else if (!open && dialogEl.open) {
      dialogEl.close();
    }
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={dialogEl}
  aria-modal="true"
  aria-label={title}
  class="rounded-lg border-2 border-red-600 p-0 backdrop:bg-black/60 max-w-md w-full"
  onclose={onCancel}
>
  <div class="p-6 theme-bg-secondary theme-text-primary">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
        <AlertTriangle class="text-red-600 dark:text-red-400" size={28} />
      </div>
      <h3 class="text-lg font-bold text-red-700 dark:text-red-300">{title}</h3>
    </div>

    <div class="mb-4 p-3 panel-red rounded border">
      <p class="panel-red-text text-sm font-medium">{message}</p>
      <p class="panel-red-text-strong text-lg font-bold mt-2">Value entered: {value}</p>
    </div>

    <p class="text-sm theme-text-secondary mb-6">
      Are you sure this value is correct? Critical values may indicate a life-threatening condition.
    </p>

    <div class="flex gap-3">
      <button
        onclick={onCancel}
        class="flex-1 py-3 min-h-[44px] rounded border theme-border-secondary theme-bg-tertiary hover:theme-bg-primary theme-text-primary font-medium transition-colors"
      >
        Go Back & Edit
      </button>
      <button
        onclick={onConfirm}
        class="flex-1 py-3 min-h-[44px] rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
      >
        Confirm Value
      </button>
    </div>
  </div>
</dialog>
