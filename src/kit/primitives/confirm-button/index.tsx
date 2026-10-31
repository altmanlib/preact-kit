import { Button, type ButtonProps } from "../button/index.tsx";

/** A button that asks `question` first and runs `onConfirm` only on a yes: the one place an irreversible action is confirmed. */
export function ConfirmButton({ question, onConfirm, ...button }: Omit<ButtonProps, "onClick"> & { question: string; onConfirm: () => void }) {
  return (
    <Button
      {...button}
      onClick={() => {
        if (confirm(question)) onConfirm();
      }}
    />
  );
}
