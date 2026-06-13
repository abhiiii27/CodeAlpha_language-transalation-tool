import { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { AppNotification } from "../../types";

interface NotificationProps {
  notification: AppNotification | null;
  onClose: () => void;
}

export default function Notification({ notification, onClose }: NotificationProps) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const bgStyles = {
    success: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300",
    error: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-300",
    info: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/50 text-indigo-800 dark:text-indigo-300",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  return (
    <div
      id={`notification-toast-${notification.id}`}
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-xl border max-w-sm w-full shadow-lg animate-slide-up ${bgStyles[notification.type]}`}
    >
      {icons[notification.type]}
      <div className="flex-1 text-sm font-medium pr-2">
        {notification.message}
      </div>
      <button
        id="dismiss-notification-btn"
        onClick={onClose}
        className="text-gray-400 hover:text-gray-650 dark:hover:text-gray-200 focus:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
