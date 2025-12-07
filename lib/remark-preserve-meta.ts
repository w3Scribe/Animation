import { visit } from 'unist-util-visit';

/**
 * Remark plugin to preserve code block metadata for interactive examples
 * Adds the meta string as a data-meta attribute on the pre element
 */
export function remarkPreserveMeta() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      // The meta string is already on node.meta from the original fence
      if (node.meta) {
        // Create an hProperties object if it doesn't exist
        if (!node.hProperties) {
          node.hProperties = {};
        }
        // Store the meta as a data attribute for later retrieval
        node.hProperties['data-meta'] = node.meta;
      }
    });
  };
}
