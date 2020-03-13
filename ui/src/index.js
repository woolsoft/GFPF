import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { injectGlobal } from 'styled-components'

injectGlobal`
  * {
   margin: 0;
   padding: 0;
   font-family: sans-serif;
  }
`

ReactDOM.render(
  <Router>
    <Route path="/" component={App} />
  </Router>,
  document.getElementById('root'),
)
