import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNotification = () => {
  return <ToastContainer />;
};

export const notifySuccess = (message: any) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const notifyError = (message: any) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const notifyInfo = (message: any) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const notifyWarning = (message: any) => {
  toast.warn(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export default ToastNotification;
