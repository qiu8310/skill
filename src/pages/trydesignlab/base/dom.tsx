
export interface IWrapMarkdownResult {
  wrap: HTMLDivElement
  children: IWrapMarkdownResult[]
}

export const dom = {
  createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, className?: string, child?: string | Element): HTMLElementTagNameMap[K] {
    let element = document.createElement(tagName)
    if (className) element.className = className
    if (child) {
      if (typeof child === 'string') element.textContent = child
      else element.appendChild(child)
    }
    return element
  },

  appendElements<T extends Node>(parent: T, ...children: T[]): T {
    for (let child of children) {
      parent.appendChild(child)
    }
    return parent
  },

  /**
   * 和 appendChild 相反
   */
  prependChild<T extends Node>(parent: T, el: T): T {
    if (parent.firstChild) parent.insertBefore(el, parent.firstChild)
    else parent.appendChild(el)
    return parent
  },

  childrenToArray(children: HTMLCollection): Element[] {
    let arr = []
    /* tslint:disable:prefer-for-of */
    for (let i = 0; i < children.length; i++) {
      arr.push(children[i])
    }
    return arr
  },

  textContent(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent
    let text = ''
    node.childNodes.forEach(n => {
      if (n.nodeType === Node.TEXT_NODE) text += n.textContent
      else if (n.nodeType === Node.ELEMENT_NODE) text += dom.textContent(n)
    })
    return text
  }
}
