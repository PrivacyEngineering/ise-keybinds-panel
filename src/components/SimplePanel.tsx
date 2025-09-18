import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from '../types';
import { GrafanaVariablesProvider, useGrafanaVariablesContext } from './GrafanaVariables/GrafanaVariablesContext';
import { Button } from '@grafana/ui';
import { VariableOverview } from './VariableOverview';

interface Props extends PanelProps<SimpleOptions> {}

const SimplePanel: React.FC<Props> = (props) => {
  const { isKiosk, setKiosk } = useGrafanaVariablesContext();

  if (!isKiosk) {
    return (
      <Button variant='primary' onClick={() => {
        setKiosk(true);
      }}>
        Enable Kioskmode
      </Button>
    );
  }

  return (
    <VariableOverview></VariableOverview>
  )

};

export default function SimplePanelRoot(props: Props) {
  return (
    <GrafanaVariablesProvider>
      <SimplePanel {...props} />
    </GrafanaVariablesProvider>
  );
};
