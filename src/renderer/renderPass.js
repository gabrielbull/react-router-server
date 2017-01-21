import * as React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import AsyncRenderer from '../components/AsyncRenderer';
import removeDuplicateModules from '../utils/removeDuplicateModules';

const renderPass = (context, element, staticMarkup = false) => {
  context.callback = () => {
    if (context.finishedLoadingModules && !context.statesRenderPass) {
      context.statesRenderPass = true;
      context.renderResult = renderPass(context, element, staticMarkup);
      if (context.fetchingStates <= 0 && context.modulesLoading <= 0) {
        context.resolve({
          html: context.renderResult,
          state: context.fetchStateResults === undefined ? null : context.fetchStateResults,
          modules: context.modules === undefined ? null : removeDuplicateModules(context.modules)
        });
      }
    } else if (context.finishedLoadingModules && context.statesRenderPass || !context.hasModules) {
      context.renderResult = renderPass(context, element, staticMarkup);
      if (context.fetchingStates <= 0 && context.modulesLoading <= 0) {
        context.resolve({
          html: context.renderResult,
          state: context.fetchStateResults === undefined ? null : context.fetchStateResults,
          modules: context.modules === undefined ? null : removeDuplicateModules(context.modules)
        });
      }
    }
  };

  let component = (
    <AsyncRenderer context={context}>
      {element}
    </AsyncRenderer>
  )
  let result;
  if (staticMarkup) {
    result = renderToStaticMarkup(component);
  } else {
    result = renderToString(component );
  }

  if (!context.hasModules && !context.hasStates) {
    context.resolve({
      html: result,
      state: context.fetchStateResults === undefined ? null : context.fetchStateResults,
      modules: context.modules === undefined ? null : removeDuplicateModules(context.modules)
    });
  }
  return result;
};

export default renderPass;
