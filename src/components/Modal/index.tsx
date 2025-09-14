import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { ModalProps } from "./types";

export function Modal(props: ModalProps) {
  const { children, isOpen, onClose, title } = props;

  const modalRef = useRef<HTMLDivElement | null>(null);

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
    <>
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out z-40 ${
          isOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      ></div>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 border border-gray-600 rounded-lg p-2 md:w-min sm:w-screen"
        ref={modalRef}
      >
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="p-4 rounded-lg">{children}</div>
      </div>
    </>
  );
}
