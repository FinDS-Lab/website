import {ReactNode, useEffect, useRef, MouseEvent, memo} from "react";
import {useStoreModal, useStoreModalValue} from "@/store/modal";
import {X} from "lucide-react";

const Modal = ({title, children}: { title?: string, children?: ReactNode }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const mouseDownTargetRef = useRef<EventTarget | null>(null);
  const {modals} = useStoreModalValue();
  const {closeModal} = useStoreModal();

  useEffect(() => {
    window.addEventListener('popstate', closeModal);

    return () => {
      window.removeEventListener('popstate', closeModal);
    };
  }, []);

  useEffect(() => {
    const el = document.querySelector('body');
    if (el) el.style.overflow = modals.length > 0 ? 'hidden' : '';
  }, [modals.length]);

  const onMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    mouseDownTargetRef.current = e.target;
  };

  const onModalClose = (e: MouseEvent<HTMLDivElement>) => {
    // mousedown과 mouseup이 모두 backdrop에서 발생했을 때만 모달 닫기
    if (modalRef.current === e.target && mouseDownTargetRef.current === e.target) closeModal();
    mouseDownTargetRef.current = null;
  };

  if (modals.length === 0) return (<></>);

  return (
    <>
      {
        modals.map((modal, index) => {
          const isTopModal = index === modals.length - 1;
          const zIndex = 50 + index;

          return (
            <div
              key={index}
              className="fixed w-full h-full top-0 left-0 flex items-center justify-center bg-black/30 dark:bg-black/50 px-40 max-md:px-16 animate-fadeIn"
              style={{zIndex: 10000 + index}}
              onMouseDown={(e) => onMouseDown(e)}
              onClick={(e) => isTopModal ? onModalClose(e) : undefined}
              ref={isTopModal ? modalRef : undefined}
            >
              <div
                className="w-full max-h-[85vh] bg-white dark:bg-[#1a1a1a] rounded-xl shadow-[rgb(0_0_0_/_15%)_0_0_6px_0] dark:shadow-[rgb(0_0_0_/_40%)_0_0_12px_0] p-20 flex flex-col items-center justify-between gap-20 relative m-[7.5vh_auto_auto_auto] animate-fadeIn transition-colors duration-300"
                style={{maxWidth: modal.maxWidth || '900px'}}
              >
                {/* X button inside modal for mobile visibility */}
                <button 
                  onClick={closeModal} 
                  className="absolute right-12 top-12 z-10 w-32 h-32 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} className="text-gray-600 dark:text-gray-400"/>
                </button>

                {
                  (title || modal.title) &&
                  <div className="flex justify-center">
                    <h2 className="text-md font-semibold dark:text-white">
                      {modal.title}
                      {title}
                    </h2>
                  </div>
                }

                <div className="w-full overflow-auto">
                  {modal.children && modal.children}
                  {index === modals.length - 1 && children && children}
                </div>
              </div>
            </div>
          );
        })
      }
    </>
  );
}

export default memo(Modal);
