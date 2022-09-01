import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Home from "./pages/Home/Home";
import Features from "./pages/Features/Features";

function Routes() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route exact path="/:query?" component={Home} />
          <Route exact path="/features/:name?" component={Features} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Routes;