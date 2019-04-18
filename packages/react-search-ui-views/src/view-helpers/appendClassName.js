export default function appendClassName(baseClassName, newClassName) {
  if (!newClassName) return baseClassName;
  return `${baseClassName} ${newClassName}`;
}
