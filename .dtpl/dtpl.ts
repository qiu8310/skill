import {Source, IDtplConfig, IData} from 'dot-template-types'

export default function(source: Source): IDtplConfig {
  let rp = source.relativeFilePath // src/pages/form/academy/Academy.tsx
  let localData: any = {}
  if (rp.indexOf('src/pages/') === 0) {
    let product = rp.split('/')[2] as string
    localData.product = product
    localData.Product = product[0].toUpperCase() + product.slice(1)
  }

  return {
    templates: [
      // 公共
      {
        name: 'template/style-widget.scss.dtpl',
        matches: 'src/**/widget/**/*.scss'
      },
      {
        name: 'template/style-page.scss.dtpl',
        matches: 'src/pages/**/*.scss'
      },
      {
        name: 'template/widget-page.tsx.dtpl',
        matches: 'src/pages/*/widget/**/*.tsx',
        related
      },
      {
        name: 'template/widget-common.tsx.dtpl',
        matches: 'src/widget/**/*.tsx',
        related
      },

      // index
      {
        name: 'template/page-index.tsx.dtpl',
        matches: 'src/pages/index/**/*.tsx',
        related
      },

      // trydesignlab
      {
        name: 'template/page-trydesignlab.tsx.dtpl',
        matches: 'src/pages/trydesignlab/**/*.tsx',
        related
      },

      // neo
      {
        name: 'template/page-neo-menu.tsx.dtpl',
        matches: 'src/pages/neo/menu-*/*.tsx',
        related
      },

      {
        name: 'template/page.tsx.dtpl',
        matches: 'src/pages/**/*.tsx',
        related,
        localData
      }
    ]
  }
}

function related(data: IData) {
  let styleFile = `./styles/${data.fileName}.scss`
  return {
    relativePath: styleFile,
    reference: `import '${styleFile}'`,
    smartInsertStyle: true
  }
}
