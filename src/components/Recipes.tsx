import { INITIAL_CONTEXT, RevenueProvider } from '../context/RevenuesContext';
import { capitalized } from '../capitalized';
import Header from './Header';
import { Scope } from '../exportTypes/types';
import RevenueList from './Revenue/RevenuesList';

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
