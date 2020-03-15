import React, { lazy, Suspense } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'

export default () => {
  return (
    <Router history={createBrowserHistory()}>
      <Switch>
        <Suspense fallback={null}>
          <Route exact path='/' component={lazy(() => import('app'))} />
        </Suspense>
      </Switch>
    </Router>
  )
}
