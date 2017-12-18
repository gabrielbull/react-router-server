<p align="center"><img width="460"src="https://rawgit.com/gabrielbull/react-router-server/master/react-router-server.svg" alt="React Router Server"></p>

<p align="center">
  <a href="https://travis-ci.org/gabrielbull/react-router-server"><img src="https://img.shields.io/travis/gabrielbull/react-router-server.svg?style=flat-square" alt="Build Status"></a>
  <a href="https://codeclimate.com/github/gabrielbull/react-router-server"><img src="https://img.shields.io/codeclimate/github/gabrielbull/react-router-server.svg?style=flat-square" alt="Code Climate"></a>
  <a href="https://www.npmjs.org/package/react-router-server"><img src="https://img.shields.io/npm/v/react-router-server.svg?style=flat-square" alt="npm version"></a>
  <a href="https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/gabrielbull/react-router-server?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge"><img src="https://img.shields.io/gitter/room/gabrielbull/react-router-server.svg?style=flat-square" alt="Gitter"></a>
</p>

<p align="center">
  Server Side Rendering library for React Router v4.
</p>

## Help wanted!

If anyone is interested in taking over this project please let me know.

## Table Of Content

1. [About](#about)
2. [Installation](#installation)
3. [Examples](#examples)
   - [Example](#complex-example)
4. [Usage](#usage)
   - [Server Side Rendering](#server-side-rendering)
   - [Code Splitting](#code-splitting)
   - [Fetch State](#fetch-state-usage)
   - [Usage with Webpack](#webpack-usage)
   - [Usage with React Router](#react-router-usage)
   - [Usage with Redux](#redux-usage)
5. [API](#api)
   - [extractModules](#extract-modules)
   - [fetchState](#fetch-state)
   - [withDone](#with-done)
   - [Module](#module)
   - [preload](#preload)
   - [renderToString](#render-to-string)
   - [ServerStateProvider](#server-state-provider)
6. [Contributing](#contributing)
7. [License](#license)

<a name="about"></a>
## About

This library allows to fetch states for your components on the server side and mount them on the client side.

It also allows to do code splitting by providing a component that can be used to load modules splitted by Webpack 2.

<a name="installation"></a>
## Installation

`npm install react-router-server --save`

<a name="examples"></a>
## Examples

<a name="complex-example"></a>
### Example

A working example using Webpack bundle and preloading is 
[provided here](https://github.com/gabrielbull/react-router-server-complex-example). 
To try for yourself, you can clone it and run it. This will provide a server accessible at 
[http://localhost:3000](http://localhost:3000).

```
git clone git@github.com:gabrielbull/react-router-server-complex-example.git
npm install
npm start
```

<a name="usage"></a>
## Usage

<a name="server-side-rendering"></a>
### Server Side rendering

To render an app that has code splitting or state fetching, you need to load the modules and states required by your app
before rendering. `react-dom/server` does not offer a function to do that, but you can use the `renderToString` function 
provided by this library. This function will return a promise that will return the rendered app once the modules and states are loaded.

```jsx
import { renderToString } from 'react-router-server';
import App from './path/to/app';

renderToString(<App/>)
  .then(({ html }) => {
    // send html to client side
  });
```  

<a name="code-splitting"></a>
### Code Splitting

The code splitting consist of a component that you can use to load modules splitted by Webpack 2. 
It also allows you to get information on the modules required to render a page so that you can preload 
the modules before displaying the page on the client side.

To use code splitting, you will need to import the `Module` component and provide the `System.import` call inside 
the module property of that component. Then, you need to defined a callback function as the children of the component.

```jsx
import { Module } from 'react-router-server';

<Module module={() => System.import('./Foo')}>
  {module => module ? <module.default/> : <div>Loading...</div>}
</Module>
```

To preload the modules on the client side, you can use the `preload` method and pass the modules from the server into that method. 

In the following example, `__INITIAL_MODULES__` would be provided by the server and rendered in the HTML document as a global variable.

```jsx
import { preload } from 'react-router-server';
import { render } from 'react-dom';
import App from './path/to/app';

preload(__INITIAL_MODULES__).then(() => render(<App/>, document.getElementById('#my-app')));
```

You can get the modules from the `renderToString` function on the server side and extract them from your webpack stats by using the `extractModules` method.
For more information on usage with webpack, check the [usage with webpack](#webpack-usage) part of this read me.

```jsx
import { renderToString, extractModules } from 'react-router-server';
import App from './path/to/app';
import stats from './path/to/stats';

renderToString(<App/>)
  .then(({ html, modules }) => {
    modules = extractModules(modules, stats);
    // send html and modules to client side
  });
```

To be able to use `System.import` calls on the server side, you will need to install the [babel-plugin-system-import-transformer](https://github.com/thgreasi/babel-plugin-system-import-transformer) plugin.

<a name="fetch-state-usage"></a>
### Fetch State

On the server side, you will often need to fetch data before rendering your component and then pass that data to the client side
so that the components are in sync.

To fetch data for your components, use the `fetchState` decorator provided by this library. The `fetchState` decorator takes two arguments,
`mapStateToProps` and `mapActionsToProps`. `mapStateToProps` allows you to map the state to the props of your component while `mapActionsToProps`
allows you to map the `done` action to the props of your component. 

```jsx
import * as React from 'react';
import { fetchState } from 'react-router-server';

@fetchState(
  state => ({ message: state.message }),
  actions => ({ done: actions.done })
)
class MyComponent extends React.Component {
  componentWillMount() {
    if (!this.props.message) {
      setTimeout(() => {
        this.props.done({ message: 'Hello world!' });
      }, 10);
    }
  }

  render() {
    return (
      <div>{this.props.message}</div>
    );
  }
}
```

To pass that state from the server to the client, you need to wrap the client app with the `ServerStateProvider` and pass the 
state from the server into that component's `state` property.

In the following example, `__INITIAL_STATE__` would be provided by the server and rendered in the HTML document as a global variable.

```jsx
import { ServerStateProvider } from 'react-router-server';
import App from './path/to/app';

<ServerStateProvider state={__INITIAL_STATE__}>
  <App/>
</ServerStateProvider>
```

You can get the state from the `renderToString` function on the server side.

```jsx
import { renderToString } from 'react-router-server';
import App from './path/to/app';

renderToString(<App/>)
  .then(({ html, state }) => {
    // send html and state to client side
  });
```

<a name="webpack-usage"></a>
### Usage with Webpack

You can extract the required modules per requests when running your server to pass them to the client side.
This allows you to preload your modules before running the client side app. To do so, you need to get the
[stats from Webpack](https://github.com/webpack/docs/wiki/node.js-api#stats).

There are many ways to do this, but we recommend using the [stats-webpack-plugin](https://github.com/unindented/stats-webpack-plugin).
Here's a code sample that you can add to your webpack config's plugins section. This will create a `stats.json` file that you can use to extract 
the required modules for your app.

```js
[
  new StatsPlugin('stats.json', {
    chunkModules: true,
    exclude: [/node_modules/]
  })
]
```

To extract the modules, you can use the `extractModules` function and pass the modules provided by the `renderToString` as well as the stats
generated by webpack. See the [code splitting usage](#code-splitting) part of this documentation to learn more on code splitting.

To be able to use `System.import` calls on the server side, you will need to install the [babel-plugin-system-import-transformer](https://github.com/thgreasi/babel-plugin-system-import-transformer) plugin.

<a name="react-router-usage"></a>
### Usage with React Router

To use with React Router v4, you can pass the `Module` component to the `Route` component of React Router.

```jsx
import { Route } from 'react-router';
import { Module } from 'react-router-server';

<Route
  exact
  path="/"
  render={matchProps => (
    <Module module={() => System.import('./Foo')}>
      {module => module ? <module.default {...matchProps}/> : <div>Loading...</div>}
    </Module>
  )}
/>
```

<a name="redux-usage"></a>
### Usage with Redux

If you are rehydrating state with redux instead of using `ServerStateProvider`, all you need is access to the `done` action so the server can wait for async stuff to complete. In that case, you can use the `withDone` decorator, which is a shorthand for `fetchState(null, ({ done }) => ({ done }))`.

```jsx
import * as React from 'react';
import { connect } from 'react-redux';
import { withDone } from 'react-router-server';
import { setMessage } from './actions';

@withDone
@connect(state => state.message, { setMessage })
class MyComponent extends React.Component {
  componentWillMount() {
    // using async actions
    const { setMessage, done } = this.props;
    setMessage('Hello world').then(done, done);
  }

  render() {
    return (
      <div>{this.props.message}</div>
    );
  }
}
```

For more details on usage with redux, check [this boilerplate](https://github.com/diegohaz/arc/tree/redux-ssr).

<a name="api"></a>
## API

<a name="extract-modules"></a>
### extractModules

`extractModules(modules, stats)`

__modules__: modules provided by the renderToString method.

__stats__: stats generated by webpack.

<a name="fetch-state"></a>
### fetchState

`fetchState(mapStateToProps, mapActionsToProps)`

__mapStateToProps(state)__: function to map the state provided by the done action
to props in your component;

__mapActionsToProps(actions)__: function to map the actions
to props in your component; Currently, only the done action exists and 
is used when you are finished fetching props.

<a name="with-done"></a>
### withDone

Shorthand for `fetchState(null, ({ done }) => ({ done }))`

<a name="module"></a>
### Module 

The Module component allows to do code splitting. The Module component takes these propeties:

__module__: a function that returns a System.import call. E.G. `() => System.import('./Foo')` 

__children__: a function. E.G. `{module => module ? <module.default/> : null}`

<a name="preload"></a>
### preload

`preload(modules)`

__modules__: array of modules passed by the server side to the client side
for preloading.

<a name="render-to-string"></a>
### renderToString

Async version of ReactDOM.renderToString.

`renderToString(element)`

__element__: The element to render

Returns an object ({ html, state, modules }) with:

__html__: the rendered HTML

__state__: the app state provided by fetch state

__modules__: the app modules provided by code splitting

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
