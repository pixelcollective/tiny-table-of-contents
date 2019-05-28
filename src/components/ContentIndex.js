import { subscribe } from '@wordpress/data'
import { Spinner } from '@wordpress/components'
import { Component } from '@wordpress/element'

import Node from './Node'
import * as Utils from '../utils'

const ulStyle = {
  paddingLeft: '0.5rem',
  marginLeft: '0.5rem',
}

class ContentIndex extends Component {
	constructor(props) {
		super(props)

		this.state = {
			headings: props.headings,
			headingSubscription: null,
		}
	}

	componentDidMount() {
		const headingSubscription = subscribe(() => {
      let headings = Utils.linearToNestedList(
				Utils.convertHeadingBlocksToAttributes(
					Utils.getHeadingBlocks()
				)
			)

			Utils.updateHeadingBlockAnchors()
			this.setState({
        headings,
      })
		})

		this.setState({
      headingSubscription,
    })
	}

	componentWillUnmount() {
		this.state.headingSubscription()
	}

	render() {
		return (this.state.headings.length > 0) ? (
      <ul style={ulStyle}>
				{this.state.headings.map(heading => (
					<Node key={heading.block.anchor} node={heading.block}>
						{heading.children}
					</Node>
				))}
      </ul>
		) : (
      <Spinner />
    )
	}
}

export default ContentIndex
