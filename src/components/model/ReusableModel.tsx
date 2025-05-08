// import { Modal as AntdModal } from "antd";
// import React, { ReactNode } from "react";

// interface ReusableModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   name: string;
//   children: ReactNode;
//   modalIcon?: boolean | string; // supports both boolean or string 'true'
//   width?: number;
//   noOverlay?: boolean;
// }

// const ReusableModal: React.FC<ReusableModalProps> = ({ isOpen, onClose, name, children, modalIcon, width = 900, noOverlay = true }) => {
//   const showIcon = modalIcon === true || modalIcon === "true";

//   return (
//     <AntdModal open={isOpen} onCancel={onClose} footer={null} mask={noOverlay} width={width} className="custom-modal">
//       <h2 className="text-[16px] font-semibold p-4 shadow-sm bg-white rounded-t-[8px]">{name}</h2>

//       {showIcon && (
//         <div className="p-4">
//           <img src="/Images/modal/modalicon.svg" alt="logo" className="w-[77px] h-[75px] mx-auto" />
//         </div>
//       )}

//       <div className="text-[16px] font-semibold p-4 bg-white m-2 rounded-[8px] shadow-md">{children}</div>
//     </AntdModal>
//   );
// };

// export default ReusableModal;
import { Modal as AntdModal } from "antd";
import React, { ReactNode } from "react";

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  children: ReactNode;
  modalIcon?: boolean | string; // supports both boolean or string 'true'
  width?: number;
  noOverlay?: boolean;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  name,
  children,
  modalIcon,
  width = 900,
  noOverlay = false, // Default to false to show overlay
}) => {
  const showIcon = modalIcon === true || modalIcon === "true";

  return (
    <AntdModal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={width}
      centered
      mask={!noOverlay}
      maskClosable={!noOverlay}
      className="custom-modal"
      title={
        <div className="modal-header">
          <h3>{name}</h3>
          {showIcon && (
            <div className="modal-icon">
              <span className="icon">🔍</span>
            </div>
          )}
        </div>
      }
    >
      {children}
    </AntdModal>
  );
};

export default ReusableModal;
