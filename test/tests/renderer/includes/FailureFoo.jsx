import React, {PureComponent} from 'react'

export default class FailureFoo extends PureComponent {
  render () {
    throw new Error('aw snap!')
  }
}
