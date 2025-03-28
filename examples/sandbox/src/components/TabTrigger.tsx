import { Tabs } from "radix-ui";

export const TabTrigger = ({
  children,
  value
}: {
  children: React.ReactNode;
  value: string;
}) => {
  return (
    <Tabs.Trigger
      value={value}
      className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 dark:data-[state=active]:border-gray-100"
    >
      {children}
    </Tabs.Trigger>
  );
};
