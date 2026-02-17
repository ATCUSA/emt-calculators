// Emergency mode store — larger touch targets and high contrast for field use
// Uses Svelte 5 runes for reactive state management

const STORAGE_KEY = 'emergency-mode';

function readFromStorage(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY) === 'true';
}

function writeToStorage(enabled: boolean): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

function applyBodyClass(enabled: boolean): void {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('emergency-mode', enabled);
}

let emergencyMode = $state(readFromStorage());

export function toggleEmergencyMode(): void {
  emergencyMode = !emergencyMode;
  writeToStorage(emergencyMode);
  applyBodyClass(emergencyMode);
}

export function getEmergencyMode(): boolean {
  return emergencyMode;
}

export function initEmergencyMode(): void {
  const stored = readFromStorage();
  emergencyMode = stored;
  applyBodyClass(stored);
}
