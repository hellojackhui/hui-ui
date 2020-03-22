export const imports = {
  'docs/Alert.mdx': () =>
    import(
      /* webpackPrefetch: true, webpackChunkName: "docs-alert" */ 'docs/Alert.mdx'
    ),
}
