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
              className="fixed inset-0 flex items-start justify-center bg-black/40 backdrop-blur-sm px-16 md:px-40 py-40 md:py-60 overflow-y-auto animate-fadeIn"
              style={{zIndex}}
              onMouseDown={(e) => onMouseDown(e)}
              onClick={(e) => isTopModal ? onModalClose(e) : undefined}
              ref={isTopModal ? modalRef : undefined}
            >
              <div
                className="w-full bg-white rounded-2xl md:rounded-3xl shadow-2xl p-24 md:p-40 flex flex-col relative my-auto"
                style={{maxWidth: modal.maxWidth || '900px'}}
              >
                {/* Close Button - Premium Style */}
                <button 
                  onClick={closeModal} 
                  className="absolute -top-12 -right-12 md:top-16 md:right-16 w-36 h-36 md:w-40 md:h-40 bg-white md:bg-gray-50 rounded-full flex items-center justify-center shadow-lg md:shadow-none hover:bg-gray-100 transition-colors group"
                >
                  <X size={18} className="text-gray-400 group-hover:text-gray-600 transition-colors"/>
                </button>

                {
                  (title || modal.title) &&
                  <div className="flex justify-center mb-24 md:mb-32">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">
                      {modal.title}
                      {title}
                    </h2>
                  </div>
                }

                <div className="w-full">
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
