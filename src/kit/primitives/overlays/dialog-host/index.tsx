import { type Signal, useSignal } from "@preact/signals";
import { type ComponentChildren, type ComponentType, createContext } from "preact";
import { useContext, useMemo } from "preact/hooks";

type Close = () => void;

type DialogApi = {
  /**
   * Open a dialog. Pass a component and its props (`onClose` is supplied by the host), or a render function that
   * receives `close`.
   */
  open: {
    <P extends { onClose: Close }>(Component: ComponentType<P>, props: Omit<P, "onClose">): void;
    (render: (close: Close) => ComponentChildren): void;
  };
  close: Close;
};

const DialogContext = createContext<DialogApi | null>(null);

/** Hosts the one open dialog of an app; mount it once near the root. */
export function DialogProvider({ children }: { children: ComponentChildren }) {
  const slot: Signal<ComponentChildren | null> = useSignal(null);

  const api = useMemo<DialogApi>(() => {
    const close: Close = () => {
      slot.value = null;
    };
    function open<P extends { onClose: Close }>(Component: ComponentType<P>, props: Omit<P, "onClose">): void;
    function open(render: (close: Close) => ComponentChildren): void;
    function open(componentOrRender: ComponentType<{ onClose: Close }> | ((close: Close) => ComponentChildren), props?: object): void {
      if (typeof componentOrRender === "function" && props !== undefined) {
        const Component = componentOrRender as ComponentType<{ onClose: Close } & Record<string, unknown>>;
        slot.value = <Component {...props} onClose={close} />;
        return;
      }
      slot.value = (componentOrRender as (close: Close) => ComponentChildren)(close);
    }
    return { open, close };
  }, [slot]);

  return (
    <DialogContext.Provider value={api}>
      {children}
      {slot.value}
    </DialogContext.Provider>
  );
}

/** The dialog host of the current tree: `open` mounts a dialog, `close` clears it (a `Modal` still plays its leave first). */
export function useDialog(): DialogApi {
  const api = useContext(DialogContext);
  if (!api) throw new Error("useDialog needs DialogProvider");
  return api;
}
