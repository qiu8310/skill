import { RouteComponentProps } from 'react-router'
import { WrappedFormUtils } from 'antd/es/form/Form'
import { IAppComponentProps } from 'mobx/AdminApp'

export {History} from 'history'
export { WrappedFormUtils, RouteComponentProps }

export interface IFormComponentProps {
  form?: WrappedFormUtils
}

export type IPageProps = IFormComponentProps & RouteComponentProps<any> & IAppComponentProps
