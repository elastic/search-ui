import {
  CardStackIcon,
  LayoutIcon,
  MagnifyingGlassIcon,
  CodeIcon,
  LightningBoltIcon,
  Link2Icon
} from "@radix-ui/react-icons";
import { Tabs } from "radix-ui";
import { ApiCard } from "@/components/ApiCard";
import { ExampleCard } from "@/components/ExampleCard";
import { UseCaseCard } from "@/components/UseCaseCard";
import { TabTrigger } from "@/components/TabTrigger";
import { useMemo } from "react";

export default function SearchUISandbox() {
  const apiCards = useMemo(
    () => [
      // TODO: Add back in when we have a production-ready connector
      // {
      //   title: "Elasticsearch Connector",
      //   description: "Production-ready, Proxy connector",
      //   href: "/elasticsearch-production-ready",
      //   recommended: true
      // },
      {
        title: "Elasticsearch Connector (Basic)",
        description: "Browser-only implementation",
        href: "/elasticsearch-basic"
      },
      {
        title: "Elastic Site Search",
        description: "Website search solution",
        href: "/site-search"
      }
    ],
    []
  );

  const exampleCards = useMemo(
    () => [
      {
        title: "Search-as-you-type",
        description: "Implement real-time search suggestions",
        href: "/search-as-you-type",
        icon: (
          <MagnifyingGlassIcon className="h-10 w-10 text-gray-900 dark:text-blue-500" />
        )
      },
      {
        title: "Customizing styles and HTML",
        description: "Learn how to customize the appearance and markup",
        href: "/customizing-styles-and-html",
        icon: (
          <CodeIcon className="h-10 w-10 text-gray-900 dark:text-blue-500" />
        )
      },
      {
        title: "Search bar in header",
        description: "Add a search bar to your site's navigation",
        href: "/search-bar-in-header",
        icon: (
          <LayoutIcon className="h-10 w-10 text-gray-900 dark:text-blue-500" />
        )
      }
    ],
    []
  );

  const useCaseCards = useMemo(
    () => [
      {
        title: "Ecommerce",
        description: "Product search implementation for online stores",
        href: "/ecommerce",
        icon: (
          <CardStackIcon className="h-12 w-12 text-gray-900 dark:text-blue-500" />
        )
      }
    ],
    []
  );

  return (
    <div className="container w-screen mx-auto py-8 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search UI Sandbox</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl">
          Explore different implementations, examples, and use cases for Search
          UI
        </p>
        <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-700 my-6" />
      </div>

      <Tabs.Root defaultValue="apis" className="w-full">
        <Tabs.List className="flex w-full border-b border-gray-200 dark:border-gray-700">
          <TabTrigger value="apis">
            <Link2Icon className="mr-2 h-4 w-4" />
            Connectors
          </TabTrigger>
          <TabTrigger value="examples">
            <CodeIcon className="mr-2 h-4 w-4" />
            Examples
          </TabTrigger>
          <TabTrigger value="usecases">
            <LightningBoltIcon className="mr-2 h-4 w-4" />
            Use Cases
          </TabTrigger>
        </Tabs.List>

        <Tabs.Content value="apis" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apiCards.map((card) => (
              <ApiCard key={card.href} {...card} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="examples" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {exampleCards.map((card) => (
              <ExampleCard key={card.href} {...card} />
            ))}
          </div>
        </Tabs.Content>

        <Tabs.Content value="usecases" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCaseCards.map((card) => (
              <UseCaseCard key={card.href} {...card} />
            ))}
            <div className="border border-dashed border-gray-300 rounded-lg">
              <div className="flex flex-row items-center justify-center h-full p-6">
                <h3 className="text-gray-500 text-lg font-medium">
                  More use cases coming soon
                </h3>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
