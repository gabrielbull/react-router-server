import React, { Component, PropTypes } from 'react';
import { importModule, Match } from 'react-router-server';
import { Link } from 'react-router';

class App extends Component {
  render() {
    return (
      <div>
        <Link to="/">Home</Link><span>&nbsp;</span>
        <Link to="/test">Click here</Link>
        <Match
          exactly
          pattern="/test"
          render={matchProps => importModule('/src/module', System.import("./module"))
            .then(module => {
              const Component = module.default;
              return <Component/>;
            })
          }
        />
      </div>
    )
  }
}

export default App;
