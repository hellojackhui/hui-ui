const { mergeWith } = require('lodash/fp')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Hui Ui',
    description: 'A UI Design language and React Component implementation',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: false,
        o: false,
        open: false,
        'open-browser': false,
        root: '/Users/huijiawei/Documents/projects/hui_ui/.docz',
        base: '/',
        source: './',
        src: './',
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Hui Ui',
        description: 'A UI Design language and React Component implementation',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/huijiawei/Documents/projects/hui_ui',
          templates:
            '/Users/huijiawei/Documents/projects/hui_ui/node_modules/docz-core/dist/templates',
          docz: '/Users/huijiawei/Documents/projects/hui_ui/.docz',
          cache: '/Users/huijiawei/Documents/projects/hui_ui/.docz/.cache',
          app: '/Users/huijiawei/Documents/projects/hui_ui/.docz/app',
          appPackageJson:
            '/Users/huijiawei/Documents/projects/hui_ui/package.json',
          gatsbyConfig:
            '/Users/huijiawei/Documents/projects/hui_ui/gatsby-config.js',
          gatsbyBrowser:
            '/Users/huijiawei/Documents/projects/hui_ui/gatsby-browser.js',
          gatsbyNode:
            '/Users/huijiawei/Documents/projects/hui_ui/gatsby-node.js',
          gatsbySSR: '/Users/huijiawei/Documents/projects/hui_ui/gatsby-ssr.js',
          importsJs:
            '/Users/huijiawei/Documents/projects/hui_ui/.docz/app/imports.js',
          rootJs:
            '/Users/huijiawei/Documents/projects/hui_ui/.docz/app/root.jsx',
          indexJs:
            '/Users/huijiawei/Documents/projects/hui_ui/.docz/app/index.jsx',
          indexHtml:
            '/Users/huijiawei/Documents/projects/hui_ui/.docz/app/index.html',
          db: '/Users/huijiawei/Documents/projects/hui_ui/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
