import { Component } from '@wordpress/element'

const ulStyle = {
  paddingLeft: '0.5rem',
  marginLeft: '0.5rem',
}

class Node extends Component {
	render() {
		return (
			<li key={this.props.node.anchor}>
        <a href={this.props.node.anchor}
           data-level={this.props.node.level}>
           {this.props.node.content}
        </a>

        {this.props.children && (
          <ul style={ulStyle}>
            {this.props.children.map(childnode => (
              <Node
                key={childnode.block.anchor}
                node={childnode.block}>
                  {childnode.children}
              </Node>
            ))}
          </ul>
        )}
			</li>
		)
	}
}

export default Node
