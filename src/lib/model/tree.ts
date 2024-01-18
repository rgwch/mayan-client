/**
 * A Tree is a node in a tree structure. It has a payload and a list of children.
 */
export interface IComparator<T> {
  compare(a: T, b: T): number
}
export interface ITreeListener {
  fetchChildren(t: Tree<any>): Promise<boolean>
}

export class Tree<T> {
  private _first: Tree<T> | null = null
  private _next: Tree<T> | null = null
  public props: any = {}

  /**
   * @param parent  - If null, this is the root node
   * @param payload - The payload of the node
   * @param listener - If a tree has a listener, it becomes a LazyTree, i.e. loads children only when fetch() is called.
   */
  constructor(
    private _parent: Tree<T> | null,
    private _payload: T,
    private listener?: ITreeListener,
  ) {
    if (_parent) {
      const sibling = _parent._first
      this._next = sibling
      _parent._first = this
    }
  }

  /**
   * get Children of this node synchronously
   * @returns 
   */
  public getChildren(): Array<Tree<T>> {
    const ret = new Array<Tree<T>>()
    let runner = this._first
    while (runner) {
      ret.push(runner)
      runner = runner._next
    }
    return ret
  }

  /**
   * ger Children of this node asynchronously (nees a listener)
   * @returns 
   */
  public async getChildrenLazy(): Promise<Array<Tree<T>>> {
    if (this.listener) {
      const result = await this.listener.fetchChildren(this)
    }
    return this.getChildren()
  }
  /**
   * remove all children of this node
   */
  public removeChildren() {
    this._first?.removeSiblings()
    this._first = null
  }
  /**
   * remove all siblings of this node
   */
  public removeSiblings() {
    if (this._next) {
      this._next.removeSiblings()
      this._next = null
    }
  }

  /**
   * Creates a new Node with the given payload. If a node with the same payload (as identified by the comparator) already exists, return that node.
   * @param payload
   * @param comparator
   * @returns
   */
  public insert(
    payload: T,
    comparator: (a: T, b: T) => number,
    listener?: ITreeListener,
  ): Tree<T> {
    let runner = this._first
    while (runner) {
      if (comparator(runner.payload, payload) === 0) {
        return runner
      } else {
        runner = runner._next
      }
    }
    return new Tree<T>(this, payload, listener)
  }

  /**
   * Removes a tree from its parent and siblings (if any)
   */
  public remove() {
    if (this.parent) {
      let runner = this.parent.first
      if (runner == this) {
        this.parent._first = this.next
      } else {
        while (runner) {
          if (runner.next == this) {
            runner._next = this.next
          }
          runner = runner._next
        }
      }
    }
    this._parent = null
    this._next = null
  }
  /**
   * Moves a complete subtree into this Tree (must be the same type)
    */
  public acquireTree(other: Tree<T>) {
    const oldparent = other.parent
    if (oldparent) {
      if (oldparent.first == other) {
        oldparent._first = other.next
      } else {
        let runner = oldparent.first
        while (runner) {
          if (runner.next == other) {
            runner._next = other.next
          }
          runner = runner.next
        }
      }
    }
    other._parent = this
    other._next = this.first
    this._first = other
  }

  setPayload = (p: T) => {
    this._payload = p
  }
  get payload() {
    return this._payload
  }
  /**
   * returns the next sibling of this node or null if there is none
   */
  get next() {
    return this._next
  }
  /**
   * returns the first child of this node or null if there is none
   */
  get first() {
    return this._first
  }
  /**
   * returns the parent of this node or null if this is the root node
   */
  get parent() {
    return this._parent
  }

  /**
   * collect all payloads of this tree and its children
   * @returns an array of payloads
   */
  async toObject(): Promise<any> {
    return {
      children: await (await this.getChildrenLazy()).map(n => n.toObject()),
      // parent: this.parent,
      payload: this.payload
    }
  }
}
