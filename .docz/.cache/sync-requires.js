const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---readme-md": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/README.md"))),
  "component---src-index-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/index.mdx"))),
  "component---src-badge-badge-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/badge/Badge.mdx"))),
  "component---src-breadcrumb-bread-crumb-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/breadcrumb/BreadCrumb.mdx"))),
  "component---src-alert-alert-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/alert/Alert.mdx"))),
  "component---src-button-button-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/button/Button.mdx"))),
  "component---src-i-18-n-i-18-n-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/i18n/i18n.mdx"))),
  "component---src-card-card-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/card/Card.mdx"))),
  "component---src-rate-rate-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/rate/Rate.mdx"))),
  "component---src-watermask-water-mask-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/watermask/WaterMask.mdx"))),
  "component---src-checkbox-checkbox-mdx": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/src/checkbox/checkbox.mdx"))),
  "component---src-pages-404-js": hot(preferDefault(require("/Users/huijiawei/Documents/projects/hui-ui/.docz/src/pages/404.js")))
}

