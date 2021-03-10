import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home } from 'containers/Home';
import { NoMatchPage } from 'containers/NoMatchPage';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route>
          <NoMatchPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
