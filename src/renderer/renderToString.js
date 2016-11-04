import AsyncRenderer from './asyncRenderer';

export default (element, context) => {
  return new Promise((resolve, reject) => {
    context.asyncRenderer = new AsyncRenderer(element, context);
    context.asyncRenderer.render(resolve, reject);
  });
};
