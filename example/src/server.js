import React from 'react';
import App from './app';
import { renderToString } from 'react-router-server';
import { ServerRouter, createServerRenderContext } from 'react-router'
import express from 'express';
import path from 'path';
import stats from '../example/stats.json';

const app = express();
const context = createServerRenderContext();

app.use(express.static(path.join(__dirname, '..', '..', 'build')));

app.get('*', function (req, res) {
  const server = (
    <ServerRouter
      location={req.url}
      context={context}
    >
      <App/>
    </ServerRouter>
  );

  renderToString(server, context)
    .then(markup => {
      const result = context.getResult();
      if (result.redirect) {
        // redirect
      } else if (result.missed) {
        // 404
      } else {
        const initialState = context.getInitialState();
        const modules = context.getModules(stats);
        res.render(
          path.join(__dirname, '..', 'example', 'index.ejs'),
          {
            markup, initialState,
            files: [].concat.apply([], modules.map(module => module.files )),
            modules: [].concat.apply([], modules.filter(module => module.key).map(module => ({
              key: module.key,
              chunk: module.id,
              module: module.moduleId
            })))
          },
          (err, html) => {
            res.send(html);
          }
        );
      }
    })
    .catch(err => console.error(err));
});

app.listen(3000, function () {
  console.log('Example site listening on 3000!');
});
