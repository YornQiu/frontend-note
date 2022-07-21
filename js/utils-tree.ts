
interface TreeNode {
  id: string;
  pid: string;
  children?: TreeNode[];
  [key: string]: any;
}

type Tree = TreeNode | TreeNode[];

const utils = {
  /**
   * @description: 将扁平数组转化为树或森林
   * @param {array} nodes 节点数组
   * @param {string} id 节点的id字段，默认为id
   * @param {string} pid 节点的父节点id字段，默认为pid
   * @param {string} children 节点的子节点字段，默认为children
   * @return {array} 树或森林
   */
  generateTree(nodes: Array<TreeNode>, id = 'id', pid = 'pid', children = 'children'): Array<TreeNode> {
    if (!Array.isArray(nodes)) {
      return [];
    }

    const tree: TreeNode[] = [];
    const treeMap: { [key: string]: TreeNode } = {};

    for (const node of nodes) {
      treeMap[node[id]] = node;
    }

    for (const node of nodes) {
      const pNode = treeMap[node[pid]];

      if (pNode) {
        (pNode[children] || (pNode[children] = [])).push(node);
      } else {
        tree.push(node);
      }
    }

    return tree;
  },

  /**
   * @description: 广度优先遍历树
   * @param {object|array} tree 树或森林
   * @param {Function} handler 用来处理树节点的方法
   */
  BFSTree(tree: Tree, handler: (node: TreeNode) => unknown) {
    if (!tree || typeof tree !== 'object') return;

    const queue = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (queue.length) {
      node = queue.shift() as TreeNode;
      handler && handler(node);
      node.children && node.children.forEach((child: TreeNode) => queue.push(child));
    }
  },

  /**
   * @description: 广度优先遍历树
   * @param {object|array} tree 树或森林
   * @param {Function} handler 用来处理树节点的方法
   */
  DFSTree(tree: Tree, handler: (node: TreeNode) => unknown) {
    if (!tree || typeof tree !== 'object') return;

    const stack = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (stack.length) {
      node = stack.pop() as TreeNode;
      handler && handler(node);
      node.children && node.children.forEach((child: TreeNode) => stack.push(child));
    }
  },

  /**
   * @description: 获取树中的某一个节点，得到一个节点后直接返回，不会继续查找
   * @param {object|array} tree 树或森林
   * @param {string} id 要获取的节点id
   * @return {object|undefined} 要获取的节点，未找到时返回undefined
   */
  getTreeNode(tree: Tree, id: string): TreeNode | undefined {
    if (!tree || typeof tree !== 'object') return;

    const queue = Array.isArray(tree) ? [...tree] : [tree];
    let node;

    while (queue.length) {
      node = queue.shift() as TreeNode;
      if (node.id === id) return node;
      node.children && node.children.forEach((child: TreeNode) => queue.push(child));
    }
  },
};
export default Object.freeze(utils);
