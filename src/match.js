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

  componentWillMount() {
    const { render } = this.props;
    this.wrapperComponent = wrapperComponent(
      render,
      { ...this.props },
      this.context.serverRouter && this.context.serverRouter.asyncRenderer ?
        this.context.serverRouter.asyncRenderer : null
    );
    const WrapperComponent = this.wrapperComponent;
    this.nextRender = matchProps => {
      return <WrapperComponent matchProps={matchProps}/>;
    }
  }

  render() {
    const { match, ...props } = this.props;
    delete props.render;
    delete props.willEnter;
    const Match = match;
    return <Match render={this.nextRender} {...props}/>;
  }
}

export default Match;
