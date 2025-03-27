import { Card } from "./Card";

export const UseCaseCard = ({ title, description, href, icon }) => (
  <Card
    title={title}
    description={description}
    href={href}
    icon={icon}
    variant="centered"
    buttonText="Explore Use Case"
    buttonVariant="primary"
  />
);
