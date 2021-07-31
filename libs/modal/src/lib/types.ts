export interface ModalDialogProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  onClose?: <T = unknown>(data?: T) => void;
  onExternalTap?: () => void;
}
