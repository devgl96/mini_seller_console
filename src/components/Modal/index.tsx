import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function Modal(props: ModalProps) {
  const { children, isOpen, onClose } = props;

  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | React.MouseEvent<HTMLDivElement>
    ) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-6 right-20 translate-x-1/2 bg-white flex z-50 border border-gray-600 rounded-lg w-auto h-auto p-2"
      ref={modalRef}
    >
      <X
        onClick={onClose}
        size="16"
        className="cursor-pointer top-1 right-1 absolute hover:text-gray-400"
      />
      <div className="p-4 rounded-lg">{children}</div>
    </div>
  );
}
