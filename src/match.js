import React, { Component, PropTypes } from 'react'
import ReactRouterMatch from 'react-router/Match';
import wrapperComponent from './wrapperComponent';

class Match extends Component {
  static propTypes = {
    render: PropTypes.func,
    match: PropTypes.func,
    ...ReactRouterMatch.propTypes
  };

  static defaultProps = {
    match: ReactRouterMatch
  };

  static contextTypes = {
    serverRouter: PropTypes.object
  }

  render() {
    const { match, render, ...props } = this.props;
    const nextRender = matchProps => wrapperComponent(
      render,
      { ...this.props },
      this.context.serverRouter && this.context.serverRouter.asyncRenderer ?
        this.context.serverRouter.asyncRenderer : null
    )(matchProps);
    delete props.willEnter;
    const Match = match;
    return <Match render={nextRender} {...props}/>;
  }
}

export default Match;
