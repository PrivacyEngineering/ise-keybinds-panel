import React, { createContext, useContext, useEffect, useState } from "react";
import { TypedVariableModel, VariableWithOptions } from "@grafana/data";
import { getTemplateSrv, locationService } from "@grafana/runtime";


const checkKiosk = () => {
  const urlSearchParams = new URLSearchParams(locationService.getLocation().search);
  return !!urlSearchParams.get('kiosk');
}

type GrafanaVariablesContextType = {
  isKiosk: boolean;
  setKiosk: (kiosk: boolean) => void;
  variables: TypedVariableModel[];
  setOptionVariable: (variable: VariableWithOptions, value: string) => void;
};

const GrafanaVariablesContext = createContext<GrafanaVariablesContextType | undefined>(undefined);

export const GrafanaVariablesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [variables, setVariables] = useState<TypedVariableModel[]>(getTemplateSrv().getVariables());
  const [isKiosk, setKiosk] = useState<boolean>(checkKiosk);
  
  const setOptionVariable = React.useCallback((variable: VariableWithOptions, value: string) => {
    locationService.partial({ [`var-${variable.name}`]: value }, true);
    setVariables(variables => {
      const newVars = variables.map(v => {
        if (v.name === variable.name) {
          if ('options' in v) {
            const current = v.options.find(o => o.value === value) || v.current;
            return {...v, current: current, options: v.options.map(o => ({...o, selected: o.value === value })) };
          }
          if ('current' in v) {
            return {...v, current: {...v.current, value: value }};
          }
        }
        return v;
      })
      return newVars as TypedVariableModel[];
    });
  }, []);

  useEffect(() => {
    const history = locationService.getHistory()
    let lastVariables: string = JSON.stringify(getTemplateSrv().getVariables());
    const unlisten = history.listen((location: any) => {
      setKiosk(checkKiosk());

      console.log('location changed', location);

      const vars = getTemplateSrv().getVariables();
      // check if variables changed
      if (lastVariables === JSON.stringify(vars)) {
        console.log('variables did not change');
        return;
      }

      // setVariables(vars);
      lastVariables = JSON.stringify(vars);
    })
    return unlisten
  }, []);

  const setKioskMode = React.useCallback((kiosk: boolean) => {
    locationService.partial({ 'kiosk': kiosk ? '1' : undefined }, true);
    // does not really work
    window.location.reload();

    setKiosk(kiosk);
  }, []);

  return (
    <GrafanaVariablesContext.Provider value={{ variables, setOptionVariable, isKiosk, setKiosk: setKioskMode }}>
      {children}
    </GrafanaVariablesContext.Provider>
  );
};

export const useGrafanaVariablesContext = () => {
  const ctx = useContext(GrafanaVariablesContext);
  if (!ctx) {
    throw new Error("useGrafanaVariablesContext must be used within GrafanaVariablesProvider");
  }
  return ctx;
};
