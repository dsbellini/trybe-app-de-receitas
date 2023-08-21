import { INITIAL_CONTEXT, RevenueProvider } from './RevenuesContext';
import { capitalized } from './capitalized';
import Header from './components';
import { Scope } from './exportTypes/types';
import RevenueList from './RevenuesList';

export type RevenuesProps = {
  scope: Scope;
};
function Revenues({ scope }: RevenuesProps) {
  return (
    <RevenueProvider
      value={ {
        ...INITIAL_CONTEXT,
        ...{ state: {
          ...INITIAL_CONTEXT.state,
          scope,
        } },
      } }
    >
      <Header pageTitle={ `Revenues - ${capitalized(scope)}` } />
      <RevenueList />
    </RevenueProvider>
  );
}

export default Revenues;
