import { showMessage } from "react-native-flash-message";

export const handleApiError = (
  error: { status: number; message: string } | unknown,
): string => {
  let message = "An unknown error occurred";

  if (typeof error === "object" && error !== null && "status" in error) {
    const { status, message: errMessage } = error as {
      status: number;
      message?: string;
    };

    switch (status) {
      case 401:
        message = "Unauthorized. Please login again.";
        break;
      case 403:
        message = "You do not have permission to perform this action.";
        break;
      case 404:
        message = "Resource not found.";
        break;
      case 500:
        message = "Server error. Please try again later.";
        break;
      default:
        if (errMessage) message = errMessage;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  showMessage({
    type: "danger",
    message: message,
    duration: 3000,
  });

  return message;
};

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "An unknown error occurred";
};
