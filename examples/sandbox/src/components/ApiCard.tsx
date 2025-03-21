import { Card } from "./Card";

export const ApiCard = ({ title, description, href, recommended = false }) => (
  <Card
    title={title}
    description={description}
    href={href}
    recommended={recommended}
    buttonText="View Implementation"
    buttonVariant={recommended ? "primary" : "default"}
  />
);
