import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to preserve code block metadata attributes
 * Ensures that data-meta attributes from remark survive rehype-pretty-code processing
 * This must run AFTER pretty-code to fix up the pre element
 */
export function rehypePreserveMeta() {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // Find pre elements
      if (node.tagName === 'pre') {
        // Check if there's a code child with the meta info
        const codeChild = node.children?.[0];
        if (codeChild && codeChild.tagName === 'code') {
          // Look for data-meta in the code element's data properties
          if (codeChild.data?.meta) {
            // Transfer meta to pre element
            if (!node.data) node.data = {};
            node.data.meta = codeChild.data.meta;
          }

          // Also check hProperties
          if (codeChild.properties?.['data-meta']) {
            if (!node.properties) node.properties = {};
            node.properties['data-meta'] = codeChild.properties['data-meta'];
          }
        }
      }
    });
  };
}
