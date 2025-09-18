import { VariableWithOptions, TypedVariableModel } from '@grafana/data';

export type GrafanaVariable = TypedVariableModel | VariableWithOptions

export const getProperty = (property: 'value' | 'max' | 'min', variable?: GrafanaVariable) => {
  if (!variable) {
    return null;
  }
  if ('current' in variable && property === 'value') {
    return variable.current?.value;
  }
  if ('options' in variable && (property === 'max' || property === 'min')) {
    const optionValues = variable.options.flatMap(c => +c.value)
    if (property === 'max') {
      return Math.max(...optionValues)
    }
    if (property === 'min') {
      return Math.min(...optionValues)
    }
  }

  return null;
}


export const getSortedOptionsOfVariable = (variable: VariableWithOptions) => {
  return [...variable.options].sort((a, b) => {
    if (+a.value !== +b.value) {
      return +a.value - +b.value;
    }
    return (a.text as string).localeCompare(b.text as string);
  });
};

export const getNextVariableOption = (variable: VariableWithOptions, step: number) => {
  const currentValue = variable.current.value;
  const options = getSortedOptionsOfVariable(variable);
  const currentIndex = options.findIndex((o) => o.value === currentValue);
  const nextIndex = Math.max(0, Math.min(options.length - 1, currentIndex + step));

  return options[nextIndex];
};

export const getNextCarrouselOption = (variables: VariableWithOptions[], step: number) => {
  // fold over the variables
  const options = variables.map((v) => getSortedOptionsOfVariable(v).map((option) => ({ ...option, variable: v })));
  if (step < 0) {
    options.reverse();
  }

  for (const opts of options) {
    const currentIndex = opts.findIndex((o) => o.selected);
    const nextIndex = Math.max(0, Math.min(opts.length - 1, currentIndex + step));
    if (nextIndex !== currentIndex) {
      return opts[nextIndex];
    }
  }

  return undefined;
};
