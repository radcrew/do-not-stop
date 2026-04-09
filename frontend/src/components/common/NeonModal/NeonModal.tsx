import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Modal from 'react-modal';

import NeonButton from '../NeonButton/NeonButton';
import './NeonModal.css';

type NeonModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  title: ReactNode;
  children: ReactNode;
  headerActions?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export default function NeonModal({
  isOpen,
  onRequestClose,
  title,
  children,
  headerActions,
  className,
  contentClassName,
}: NeonModalProps) {
  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  const modalClassName = ['neon-modal', className].filter(Boolean).join(' ');
  const bodyClassName = ['neon-modal-body', contentClassName].filter(Boolean).join(' ');

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={modalClassName}
      overlayClassName="neon-modal-overlay"
      shouldCloseOnOverlayClick
      shouldCloseOnEsc
    >
      <div className="neon-modal-header">
        <h3 className="neon-modal-title">{title}</h3>
        <div className="neon-modal-controls">
          {headerActions}
          <NeonButton
            className="neon-modal-close-btn"
            onClick={onRequestClose}
            tone="cyan"
            size="sm"
            aria-label="Close modal"
          >
            Close
          </NeonButton>
        </div>
      </div>
      <div className={bodyClassName}>{children}</div>
    </Modal>
  );
}
