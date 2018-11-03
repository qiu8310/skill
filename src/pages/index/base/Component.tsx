import * as React from 'react'
import * as MD from 'react-markdown'

import {Loading} from 'mora-common'
import {Page, PageComponent} from 'mobx/IndexApp'

export function Markdown(props: MD.ReactMarkdownProps) {
  let {className, ...rest} = props
  return <MD className={'gMarkdown' + (className ? ' ' + className : '')} {...rest} />
}

export abstract class MarkdownPageComponent<P> extends PageComponent<P, {content: string | null}> {
  abstract url: string
  abstract pageName: string
  abstract pageTitle: string

  state = {
    content: null
  }

  onClick(e: React.MouseEvent<any>) {}
  onMarkdown(content: string) {}

  async componentWillMount() {
    let res = await fetch(this.url)
    let content = await res.text()
    this.setState({content}, () => this.onMarkdown(content))
  }

  render() {
    let {state: {content}} = this
    return (
      <Page name={this.pageName} title={this.pageTitle}>
        {
          content
            ? (
              <div onClick={this.onClick.bind(this)}>
                <Markdown source={this.state.content} />
              </div>
            )
            : <Loading />
        }
      </Page>
    )
  }
}
