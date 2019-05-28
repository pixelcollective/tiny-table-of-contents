// @wordpress
import { __ } from '@wordpress/i18n'
import { registerBlockType } from '@wordpress/blocks'

import * as Utils from './utils'
import ContentIndex from './components/ContentIndex'
import Icon from './components/Icon'

// supports
const supports = {
  html: false,
  multiple: false,
}

// attributes
const attributes = {
  headings: {
    source: 'query',
      selector: 'a',
        query: {
      content: {
        source: 'text',
        },
      anchor: {
        source: 'attribute',
          attribute: 'href',
        },
      level: {
        source: 'attribute',
          attribute: 'data-level',
        },
    },
  },
}

// edit
const edit = (props) => {
  let headings = props.attributes.headings || []
  const newHeadings = Utils.convertHeadingBlocksToAttributes(Utils.getHeadingBlocks())

  if (Utils.haveHeadingsChanged(headings, newHeadings)) {
    props.setAttributes({
      headings: newHeadings,
    })

    Utils.updateHeadingBlockAnchors()
  }

  return (
    <div className={props.className}>
      <ContentIndex headings={Utils.linearToNestedList(headings)} blockObject={props} />
    </div>
  )
}

// save
const save = (props) => {
  return props.attributes.headings.length === 0 ? null : (
    <div className={props.className}>
      <ContentIndex headings={Utils.linearToNestedList(props.attributes.headings)} />
    </div>
  )
}

/**
 * Register our Gutenberg block.
 */
registerBlockType('tinyblocks/table-of-contents', {
	title: __('Table of Contents'),
	description: __('Add a list of hyperlinks pointing to post headings. Heading order must be semantic (h1 cannot be a child a of h3, for example)'),
	icon: <Icon />,
	category: 'common',
	attributes,
	supports,
	edit,
	save,
})
