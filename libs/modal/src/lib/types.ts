export interface ModalContainerProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {
  containerId?: string;
}

export interface ModalDialogProps
  extends ModalProps,
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > {
  onClose?: (data?: unknown) => void;
  onExternalTap?: () => void;
}

export interface ModalProps {
  containerId?: string;
}
