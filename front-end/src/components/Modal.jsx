import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import PropTypes from "prop-types";
export default function Modal({ isOpen, setOpen, children, mode }) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="bg-white rounded-t-xl border-b border-slate-400">
                <h1 className="text-3xl font-semibold">{mode}</h1>
              </div>
              <div className="sm:flex sm:items-start py-3">{children}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  mode: PropTypes.string,
};
