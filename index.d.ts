export as namespace ReactRouterServer;
export = ReactRouterServer;

import { Component, ReactElement, ReactNode } from 'react';

declare namespace ReactRouterServer {
  type ExtractedModule = {
    id: string,
    files: Array<any>;
  };
  function extractModules(modules: Array<any>, stats: any): Array<ExtractedModule>;

  function fetchState<P, S>(mapStateToProps?: (state: any) => any, mapActionsToProps?: (actions: { done: (state: any) => void }) => any): Component<P, S>;

  function withDone(WrappedComponent: Component): Component;

  interface ModuleProps {
    module: () => any;
    children?: (module: any) => any;
  }

  class Module<P extends ModuleProps, S> extends Component<P, S> {
  }

  function preload(modules: any): Promise<any>;

  function renderToString(element: ReactElement<any>): Promise<{ html: string, modules: any, state: any }>;

  function renderToStaticMarkup(element: ReactElement<any>): Promise<{ html: string, modules: any, state: any }>;

  interface ServerStateProviderProps {
    state?: any;
    children?: ReactNode;
  }

  class ServerStateProvider<P extends ServerStateProviderProps, S> extends Component<P, S> {
  }
}
