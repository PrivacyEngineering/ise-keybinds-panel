import { VariableWithOptions } from '@grafana/data';
import React, { useCallback } from 'react';
import { AnonymityVisualization } from './AnonymityVisualization/AnonymityVisualization';
import { useGrafanaVariablesContext } from './GrafanaVariables/GrafanaVariablesContext';
import { getNextVariableOption } from './GrafanaVariables/variableUtils';
import { useKeybinds, KeybindValue } from './utils/useKeybinds';



export const VariableOverview: React.FC = () => {
  const { variables, setOptionVariable } = useGrafanaVariablesContext();
  const displayVariables = ["k", "l", "delta"]
  const filteredVariables = variables.filter(v => displayVariables.includes(v.name)) as VariableWithOptions[];

  const onAction = useCallback((key: KeybindValue) => {
    const map: { [K in KeybindValue]?: [string, number] } = {
      'K_up': ['k', 1],
      'K_down': ['k', -1],
      'L_up': ['l', 1],
      'L_down': ['l', -1],
      'Delta_up': ['delta', 1],
      'Delta_down': ['delta', -1]
    };
    const [v, step] = map[key] || [];
    if (!v || !step) {
      return;
    }
    const variable = variables.find(vari => vari.name === v) as VariableWithOptions | undefined;
    if (!variable) {
      return;
    }
    const nextOption = getNextVariableOption(variable, step);

    if (nextOption) {
      setOptionVariable(variable, nextOption.value as string);
    }
  }, [setOptionVariable, variables]);

  useKeybinds(onAction);


  return (
    <div>
      <AnonymityVisualization
        k={filteredVariables.find(v => v.name === 'k')!}
        l={filteredVariables.find(v => v.name === 'l')!}
        delta={filteredVariables.find(v => v.name === 'delta')!}
      ></AnonymityVisualization>
    </div>
  );
}
