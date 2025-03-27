import { Card } from "./Card";

export const ExampleCard = ({ title, description, href, icon }) => (
  <Card
    title={title}
    description={description}
    href={href}
    icon={icon}
    buttonText="View Example"
  />
);
