import { useEffect } from 'react';
import { useGrafanaVariablesContext } from 'components/GrafanaVariables/GrafanaVariablesContext';


export enum Keybind {
  K_down = '1',
  K_noop = '2',
  K_up = '3',
  L_down = '4',
  L_noop = '5',
  L_up = '6',
  Delta_down = '7',
  Delta_noop = '8',
  Delta_up = '9',
}
export type KeybindValue = keyof typeof Keybind;
export type KeybindKey = typeof Keybind[KeybindValue];

export const useKeybinds = (onAction?: (key: KeybindValue) => void) => {
  const { isKiosk } = useGrafanaVariablesContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isKiosk) {
        // don't handle keybinds in kiosk mode
        return;
      }
      // stop all propagation of the event (so Grafana doesn't also handle it)
      event.stopPropagation();

      // prevent default action (like scrolling the page)
      event.preventDefault();

      const key = event.key as KeybindKey;

      // find keybind
      const [k, v] = Object.entries(Keybind).find(([k, v]) => v === key) || [];

      console.log('key pressed', key, k, v);
      
      if (onAction && k && v) {
        onAction(k as KeybindValue);
      }
    };
    
    // Capture the event in the capture phase to ensure it gets handled before Grafana's own handlers
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [isKiosk, onAction]);

}
