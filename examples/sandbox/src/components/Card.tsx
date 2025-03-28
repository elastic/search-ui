import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "primary" | "centered";
  buttonText?: string;
  buttonVariant?: "default" | "primary";
  recommended?: boolean;
}

export const Card = ({
  title,
  description,
  href,
  icon,
  variant = "default",
  buttonText = "View Details",
  buttonVariant = "default",
  recommended = false
}: CardProps) => {
  const cardContent = () => {
    switch (variant) {
      case "centered":
        return (
          <div className="flex flex-col items-center text-center space-y-1.5 p-6 pb-2">
            <div className="mx-auto mb-4">{icon}</div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="flex items-center space-x-4">
              {icon && <div className="flex-shrink-0">{icon}</div>}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  {recommended && (
                    <span className="ml-1 inline-flex items-center rounded-full bg-gray-900 dark:bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-lg border ${
        recommended ? "border-gray-900 dark:border-blue-600" : "border-gray-200"
      } bg-white shadow-sm dark:bg-gray-900 dark:border-gray-800`}
    >
      {cardContent()}
      <div className="flex items-center p-6 pt-0">
        <Link
          to={href}
          className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium ${
            buttonVariant === "primary"
              ? "bg-gray-900 text-[#f9fafb] hover:bg-gray-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          }`}
        >
          {buttonText}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
