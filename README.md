# ![React Router Server](https://rawgit.com/gabrielbull/react-router-server/master/react-router-server2.svg "React Router Server")

[![Build Status](https://travis-ci.org/gabrielbull/react-router-server.svg?branch=master)](https://travis-ci.org/gabrielbull/react-router-server)
[![Code Climate](https://codeclimate.com/github/gabrielbull/react-router-server/badges/gpa.svg)](https://codeclimate.com/github/gabrielbull/react-router-server)
[![Dependency Status](https://david-dm.org/gabrielbull/react-router-server.svg)](https://david-dm.org/gabrielbull/react-router-server)
[![peerDependency Status](https://david-dm.org/gabrielbull/react-router-server/peer-status.svg)](https://david-dm.org/gabrielbull/react-router-server#info=peerDependencies)
[![devDependency Status](https://david-dm.org/gabrielbull/react-router-server/dev-status.svg)](https://david-dm.org/gabrielbull/react-router-server#info=devDependencies)
[![npm downloads](http://img.shields.io/npm/dt/react-router-server.svg)](https://www.npmjs.org/package/react-router-server)
[![npm version](https://img.shields.io/npm/v/react-router-server.svg)](https://www.npmjs.org/package/react-router-server)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gabrielbull/react-router-server?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Server Side Rendering library for React Router v4. Allows to do 
code-splitting using webpack and to fetch data. Renders the page on 
the server side and resolves all issues with mounting on the client side.

## Table Of Content

1. [Installation](#installation)
2. [Example](#example)
3. [Usage](#usage)
    * [Loading code splitted module](#loading-code-splitted-module)
    * [Loading props on the server side](#loading-props-on-the-server-side)    
    * [Server Side](#server-side)    
    * [Client Side](#client-side)    
4. [API](#api)
    * [fetchProps](#fetch-props)
    * [importModule](#import-module)
    * [Match](#match)
    * [preloadModules](#preload-modules)
    * [renderToString](#render-to-string)
    * [ServerStateProvider](#server-state-provider)
5. [Contributing](#contributing)
6. [License](#license)

<a name="installation"></a>
## Installation

> npm install react-router-server --save

<a name="example"></a>
## Example

A working example is provided in the example directory of this project.
To try for yourself, you can clone this project and run `npm run start`. 
This will provide a server accessible at 
[http://localhost:3000](http://localhost:3000).

<a name="usage"></a>
## Usage

<a name="loading-code-splitted-module"></a>
### Loading code splitted module

To load a module splitted by webpack use the `importModule` method and 
 the `Match` component provided by this library.

```jsx
import { Match, importModule } from 'react-router-server';

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
```

<a name="loading-props-on-the-server-side"></a>
### Loading props on the server side

To load props for your components to render on the server side, 
use the `fetchProps` decorator.

```jsx
@fetchProps(
  state => ({
    isLoaded: state.user ? true : false,
    user: state.user
  }),
  actions => ({
    done: actions.done
  })
)
class MyComponent extends Component {
  componentWillMount() {
    if (!this.props.isLoaded) {
      loadAsyncUser()
        .then(user => this.props.done({ user }));
    }
  }
  
  render() {
    ...
  }
}
```

<a name="server-side"></a>
### Server Side

You need to use the renderToString provided by this library:

```jsx
import renderToString from 'react-router-server';
import { ServerRouter, createServerRenderContext } from 'react-router'

const context = createServerRenderContext();

renderToString(
    <ServerRouter
      location={'/current/path/' /* provide the request url */}
      context={context}
    >
      <App/>
    </ServerRouter>
);
```

An initial state and modules to preload will be passed through the context.
You will need to pass these to your HTML template to preload the modules 
and pass the initialState to the client side.

```jsx
import stats from './stats.json';

const initialState = context.getInitialState();
const modules = context.getModules(stats);
```

You will need to get the webpack stats to extract the modules from webpack.
To do this, you can use the `stats-webpack-plugin` and add this line
to your webpack config plugins.

```jsx
  plugins: [
    new StatsPlugin('stats.json')
  ]
```

<a name="client-side"></a>
### Client Side

Preload the modules in your HTML file if you are using code-splitting.
Pass the initial state and modules to your app.

```html
<link rel="preload" href="/path/to/module" as="script">

<script>
  window.__INITIAL_STATE__ = ...;
  window.__INITIAL_MODULES__ = ...;
</script>
```

Preload the modules in your JS before rendering the app.

```jsx
import React from 'react';
import { BrowserRouter } from 'react-router';
import { render } from 'react-dom';
import { preloadModules, ServerStateProvider } from 'react-router-server';

preloadModules(__INITIAL_MODULES__).then(() => {
  render((
    <ServerStateProvider state={__INITIAL_STATE__}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ServerStateProvider>
  ), document.getElementById('main'));
});
```

<a name="api"></a>
## API

<a name="fetch-props"></a>
### fetchProps

`fetchProps(mapStateToProps, mapActionsToProps)`

__mapStateToProps(state)__: function to map the state provided by the done action
to props in your component;

__mapActionsToProps(actions)__: function to map the actions
to props in your component; Currently, only the done action exists and 
is used when you are finished fetching props.

<a name="import-module"></a>
### importModule

`importModule(name, module)`

__name__: Unique name of your module.

__module__: A `System.import("./path/to/your/module")` call.

<a name="match"></a>
### Match 

The Match component is the same as the react-router Match component but 
can be used for async render methods.

<a name="preload-modules"></a>
### preloadModules

`preloadModules(modules)`

__modules__: array of modules passed by the server side to the client side
for preloading.

<a name="render-to-string"></a>
### renderToString

Async version of ReactDOm.renderToString.

```renderToString(element, context)```

__element__: The element to render

__context__: The server context.

<a name="server-state-provider"></a>
### ServerStateProvider

The ServerStateProvider component is used for providing the server state 
to the client side. Provided by the `state` prop.

<a name="contributing"></a>
## Contributing

Everyone is welcome to contribute and add more components/documentation whilst following the [contributing guidelines](/CONTRIBUTING.md).

<a name="license"></a>
## License

React Router Server is licensed under [The MIT License (MIT)](LICENSE).
