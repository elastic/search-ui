import type { ConditionalRuleFn } from "./";

function FilterNotSelected(
  fieldName: string,
  value?: string
): ConditionalRuleFn {
  return ({ filters }) => {
    return !filters.some(
      (f) => f.field === fieldName && (!value || f.values.includes(value))
    );
  };
}

function FilterIsSelected(
  fieldName: string,
  value?: string
): ConditionalRuleFn {
  return ({ filters }) => {
    return filters.some(
      (f) => f.field === fieldName && (!value || f.values.includes(value))
    );
  };
}

function Must(rules: ConditionalRuleFn[]): ConditionalRuleFn {
  return ({ filters }) => {
    return rules.every((rule) => rule({ filters }));
  };
}

function Should(rules: ConditionalRuleFn[]): ConditionalRuleFn {
  return ({ filters }) => {
    return rules.some((rule) => rule({ filters }));
  };
}

export const Rule = {
  FilterIsSelected,
  FilterNotSelected,
  Must,
  Should
};
