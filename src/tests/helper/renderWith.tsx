import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

type Option = {
  initialEntries?: string[];
  initialState?: any;
};

function withRouter(component: React.ReactElement, initialEntries: string[]) {
  return (
    <MemoryRouter initialEntries={ initialEntries }>
      { component }
    </MemoryRouter>
  );
}

export function renderWithRouter(
  component: React.ReactElement,
  {
    initialEntries = ['/'],
  }: Option = {},
) {
  return render(withRouter(component, initialEntries));
}
