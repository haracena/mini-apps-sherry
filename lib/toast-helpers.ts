import { toast } from "sonner";

export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 4000,
  });
};

export const toastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 5000,
  });
};

export const toastInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 4000,
  });
};

export const toastWarning = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 4500,
  });
};

export const toastLoading = (message: string) => {
  return toast.loading(message);
};

export const toastPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, messages);
};
