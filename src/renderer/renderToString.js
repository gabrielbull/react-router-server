import * as React from 'react';
import { renderToString } from 'react-dom/server';
import AsyncRenderer from '../components/AsyncRenderer';

const renderPass = (context, element) => {
  context.callback = () => renderPass(context, element);

  const result = renderToString(
    <AsyncRenderer context={context}>
      {element}
    </AsyncRenderer>
  );

  if (context.fetchingStates <= 0 && context.modulesLoading <= 0) {
    context.resolve(result);
  }
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
