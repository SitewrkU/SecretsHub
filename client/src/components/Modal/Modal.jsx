import * as Dialog from '@radix-ui/react-dialog';
import styles from './Modal.module.css';

const Modal = ({ open, onOpenChange, title, children }) => {
  return (
    <Dialog.Root open={open} 
    onOpenChange={onOpenChange}
     >
      <Dialog.Portal>
        <Dialog.Overlay className={styles.modalOverlay} />
        <Dialog.Content 
          className={styles.modalContent}
          aria-describedby={undefined}
        >
          {title && <Dialog.Title className={styles.modalTitle}>{title}</Dialog.Title>}

          <div className={styles.modalBody}>{children}</div>

          <Dialog.Close className={styles.modalClose} aria-label="Закрити">
            ×
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;