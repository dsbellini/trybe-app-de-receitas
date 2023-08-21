import { createContext, useState } from 'react';
import { ContextState, RevenueType } from '../exportTypes/types';

export const INITIAL_CONTEXT: RevenueType = {
  state: {
    scope: 'meals',
    searchParams: {
      term: '',
      type: 's',
    },
    recipes: [],
  },
  update: () => {},
};

export const RevenueContext = createContext(INITIAL_CONTEXT);
export function RevenueProvider({ value, children }: any) {
  const [innerState, setInnerState] = useState<RevenueType>(
    { ...INITIAL_CONTEXT, ...value },
  );
  const updateState = (data: Partial<ContextState>) => {
    setInnerState({
      ...innerState,
      ...{ state: {
        ...innerState.state,
        ...data,
      } },
    });
  };
  return (
    <RevenueContext.Provider value={ { ...innerState, update: updateState } }>
      {children}
    </RevenueContext.Provider>
  );
}
