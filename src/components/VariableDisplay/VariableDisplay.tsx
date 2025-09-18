import { TypedVariableModel, VariableWithOptions } from '@grafana/data';
import { Button } from '@grafana/ui';
import { useGrafanaVariablesContext } from 'components/GrafanaVariables/GrafanaVariablesContext';
import { getSortedOptionsOfVariable } from 'components/GrafanaVariables/variableUtils';
import React from 'react';
import './variableDisplay.css';

interface VariableDisplayProps {
  variable: TypedVariableModel | VariableWithOptions;
}

export const VariableDisplay: React.FC<VariableDisplayProps> = ({ variable }) => {

  const { setOptionVariable } = useGrafanaVariablesContext();

  if (!('options' in variable) || !('current' in variable)) {
    return (
      <div>
        No options in variable {variable.name}
      </div>
    );
  }

  return (
    <div className='vd-container'>
      <span className='vd-name'>{variable.name}:</span>
      <span className='vd-value'>{variable.current.text}</span>
      <div className='vd-options'>
        {getSortedOptionsOfVariable(variable).map(o => (
          <Button
            key={o.text as string}
            size='sm'
            variant={o.selected ? 'primary' : 'secondary'}
            onClick={() => setOptionVariable(variable, o.value as string)}
          >
            {o.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
