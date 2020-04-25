  
exports.onCreateWebpackConfig = ({
    stage,
    loaders,
    actions
}) => {
    if (stage === "build-html") {
        actions.setWebpackConfig({
            module: {
                rules: [{
                    test: /bad-module/,
                    use: loaders.null(),
                }, {
                    test: /\.(scss)$/,
                    use: [
                      loaders.style(),
                      loaders.css(),
                      "sass-loader"
                    ]
                }],
            },
        })
    }
}