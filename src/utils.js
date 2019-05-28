import { select } from '@wordpress/data'

import slugify from 'slugify'

/**
 * Recursively scan for a block
 */
const recursivelyScanForBlock = (blockTypeName, block, blocks) => {
  block.innerBlocks && block.innerBlocks.flatMap(innerBlock => {
    recursivelyScanForBlock(blockTypeName, innerBlock, blocks)
  })
  block.name == blockTypeName && blocks.push(block)
}

/**
 * Retrieve heading blocks from core/editor data
 */
export function getHeadingBlocks() {
  let blocks = []
  select('core/editor').getBlocks().flatMap(block => {
    recursivelyScanForBlock('core/heading', block, blocks)
  })

  return blocks
}

/**
 * Linear to Nested List
 */
export function linearToNestedList(array) {
  const returnValue = []

  array.forEach((heading, key) => {
    // lookup key for next array item
    const nextKey = key + 1

    if (heading.level === array[0].level) {
      if (typeof array[nextKey] !== 'undefined'  // look before leaping
      && array[nextKey].level > heading.level) { // is parent?

        // slice array by heading level
        let levelSlice = array.length
        for (let i = nextKey; i < array.length; i++) {
          if (array[i].level === heading.level) {
            levelSlice = i
            break
          }
        }

        // push parent heading node
        returnValue.push({
          block: heading,
          children: linearToNestedList(array.slice(nextKey, levelSlice)),
        })
      } else {
        // push terminal heading node if it has content
        heading.content !== '' && returnValue.push({
          block: heading,
          children: null,
        })
      }
    }
  })

  return returnValue
}

/**
 * Convert Headings to Attributes
 */
export function convertHeadingBlocksToAttributes(headingBlocks) {
  return headingBlocks.map(function (heading) {
    const level = heading.attributes.level.toString()

    let headingContent = heading.attributes.content || ''
    let anchorContent = heading.attributes.anchor || ''

    // strip html from heading and attribute content
    let contentDiv = document.createElement('div')

    contentDiv.innerHTML = headingContent
    const content = contentDiv.textContent || contentDiv.innerText || ''

    contentDiv.innerHTML = anchorContent
    let anchor = contentDiv.textContent || contentDiv.innerText || ''

    if (anchor !== '' && anchor.indexOf('#') === -1) {
      anchor = '#' + slugify(anchor, { remove: /[^\w\s-]/g })
    }

    return { content, anchor, level }
  })
}

export function updateHeadingBlockAnchors() {
  // Add anchors to any headings that don't have one.
  getHeadingBlocks().forEach(function (heading, key) {
    const headingAnchorEmpty = (typeof heading.attributes.anchor === 'undefined' || heading.attributes.anchor === '')
    const headingContentEmpty = (typeof heading.attributes.content === 'undefined' || heading.attributes.content === '')
    const headingDefaultAnchor = (!headingAnchorEmpty && heading.attributes.anchor.indexOf(key + '-') === 0)

    if (!headingContentEmpty && (headingAnchorEmpty || headingDefaultAnchor)) {
      heading.attributes.anchor = key + '-' + slugify(heading.attributes.content.toString(), { remove: /[^\w\s-]/g })
    }
  })
}

export function haveHeadingsChanged(oldHeadings, newHeadings) {
  if (oldHeadings.length !== newHeadings.length) {
    return true
  }

  const changedHeadings = oldHeadings.filter((heading, index) => {
    const newHeading = newHeadings[index]

    return (
      heading.content !== newHeading.content ||
      heading.anchor !== newHeading.anchor ||
      heading.level !== newHeading.level
    )
  })

  // Return boolean value from length.
  return ! ! +changedHeadings.length
}
