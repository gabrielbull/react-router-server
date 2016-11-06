import * as React from 'react';
import { renderToString } from 'react-dom/server';
import AsyncRenderer from '../components/AsyncRenderer';
import removeDuplicateModules from '../utils/removeDuplicateModules';

const renderPass = (context, element) => {
  context.callback = () => {
    if (context.finishedLoadingModules && !context.statesRenderPass) {
      context.statesRenderPass = true;
      context.renderResult = renderPass(context, element);
      if (context.fetchingStates <= 0 && context.modulesLoading <= 0) {
        context.resolve({
          html: context.renderResult,
          state: context.fetchStateResults,
          modules: removeDuplicateModules(context.modules)
        });
      }
    } else if (context.finishedLoadingModules && context.statesRenderPass) {
      context.renderResult = renderPass(context, element);
      if (context.fetchingStates <= 0 && context.modulesLoading <= 0) {
        context.resolve({
          html: context.renderResult,
          state: context.fetchStateResults,
          modules: removeDuplicateModules(context.modules)
        });
      }
    }
  };

  const result = renderToString(
    <AsyncRenderer context={context}>
      {element}
    </AsyncRenderer>
  );

  if (!context.hasModules && !context.hasStates) {
    context.resolve({
      html: result,
      state: null,
      modules: null
    });
  }
  return result;
};

export default (element) => {
  return new Promise((resolve, reject) => {
    const context = {
      resolve, reject,
      modulesLoading: 0,
      fetchingStates: 0
    };
    renderPass(context, element);
  });
};
