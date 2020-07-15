import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { JoinPage } from './screens/join';
import { CreatePage } from './screens/create';
import HomePage from './screens/home';
import { InfoPage } from './screens/info';
import { PlayPage } from './screens/play';
import { Clickable } from './reusables/Clickable';
import { isMobile } from './constants.js';
import './App.css';

export const App = () => {
  const [values, setValues] = useState({
    token: sessionStorage.getItem('token'),
    name: sessionStorage.getItem('name'),
    code: sessionStorage.getItem('code'),
  });
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  const setNewVals = (newVals) => {
    console.log('updating sessionStorage');
    sessionStorage.setItem('token', newVals.token);
    sessionStorage.setItem('name', newVals.name);
    sessionStorage.setItem('code', newVals.code);
    setValues(newVals);
  };

  return (
    <Router>
      <Switch>
        <React.Fragment>
          <div className="wrapper">
            <div className={isMobile ? 'innerMobile' : 'inner'}>
              <Route path="/create">
                <CreatePage
                  values={values}
                  setValues={(newVals) => {
                    setNewVals(newVals);
                  }}
                />
              </Route>
              <Route path="/join">
                <JoinPage
                  setValues={(newVals) => {
                    setNewVals(newVals);
                  }}
                />
              </Route>
              <Route path="/info">
                <InfoPage />
              </Route>
              <Route path="/play">
                {values.token ? (
                  <PlayPage values={values} />
                ) : (
                  <>
                    <p className="text">something went wrong</p>
                    <Clickable text={'go back'} onClick={() => (window.location.href = '/')} />
                  </>
                )}
              </Route>
              <Route path="/">
                {window.location.pathname === '/' && (
                  <HomePage
                    setToken={(token) => {
                      console.log('setting token to', token);
                      sessionStorage.setItem('token', token);
                      setValues((...prev) => ({ ...prev, token }));
                    }}
                  />
                )}
              </Route>
            </div>
          </div>
        </React.Fragment>
      </Switch>
    </Router>
  );
};
