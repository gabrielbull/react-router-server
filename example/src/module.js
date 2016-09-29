import React, { Component, PropTypes } from 'react';
import { fetchProps } from 'react-router-server';

@fetchProps(
  state => ({
    isLoaded: state.message,
    message: state.message
  }),
  actions => ({
    done: actions.done
  })
)
class Module extends Component {
  constructor() {
    super();
    this.state = {
      color: 'red'
    }
  }

  componentWillMount() {
    if (!this.props.isLoaded) {
      setTimeout(() => {
        this.props.done({ message: 'I am ready to be displayed' });
      }, 2000);
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.changeColor, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  changeColor = () => {
    this.setState({ color: this.state.color === 'red' ? 'blue' : 'red' });
  };

  render() {
    const { message } = this.props;
    const { color } = this.state;
    return (
      <div style={{ color }}>
        {message}
      </div>
    );
  }
}

export default Module;
