// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---readme-md": () => import("./../../README.md" /* webpackChunkName: "component---readme-md" */),
  "component---src-index-mdx": () => import("./../../src/index.mdx" /* webpackChunkName: "component---src-index-mdx" */),
  "component---src-badge-badge-mdx": () => import("./../../src/badge/Badge.mdx" /* webpackChunkName: "component---src-badge-badge-mdx" */),
  "component---src-breadcrumb-bread-crumb-mdx": () => import("./../../src/breadcrumb/BreadCrumb.mdx" /* webpackChunkName: "component---src-breadcrumb-bread-crumb-mdx" */),
  "component---src-alert-alert-mdx": () => import("./../../src/alert/Alert.mdx" /* webpackChunkName: "component---src-alert-alert-mdx" */),
  "component---src-button-button-mdx": () => import("./../../src/button/Button.mdx" /* webpackChunkName: "component---src-button-button-mdx" */),
  "component---src-i-18-n-i-18-n-mdx": () => import("./../../src/i18n/i18n.mdx" /* webpackChunkName: "component---src-i-18-n-i-18-n-mdx" */),
  "component---src-card-card-mdx": () => import("./../../src/card/Card.mdx" /* webpackChunkName: "component---src-card-card-mdx" */),
  "component---src-rate-rate-mdx": () => import("./../../src/rate/Rate.mdx" /* webpackChunkName: "component---src-rate-rate-mdx" */),
  "component---src-watermask-water-mask-mdx": () => import("./../../src/watermask/WaterMask.mdx" /* webpackChunkName: "component---src-watermask-water-mask-mdx" */),
  "component---src-checkbox-checkbox-mdx": () => import("./../../src/checkbox/checkbox.mdx" /* webpackChunkName: "component---src-checkbox-checkbox-mdx" */),
  "component---src-pages-404-js": () => import("./../src/pages/404.js" /* webpackChunkName: "component---src-pages-404-js" */)
}

