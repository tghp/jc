module.exports = {
    siteMetadata: {
        title: `JC`,
        siteUrl: `http://jc.test`
    },
    plugins: [
        {
            resolve: 'gatsby-source-wordpress',
            options: {
                "url": "http://jc.test/wp/graphql"
            }
        },
        "gatsby-plugin-sass",
        "gatsby-plugin-image",
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                "name": "images",
                "path": "./src/images/"
            },
            __key: "images"
        },
        {
            resolve: "gatsby-source-wordpress-menus",
            options: {
                wordpressUrl: "http://jc.test",
                languages: ["en"],
                enableWpml: false,
                allowCache: true,
                maxCacheDurationSeconds: 60 * 60 * 24
            },
        },
        {
            resolve: "gatsby-plugin-react-svg",
            options: {
                rule: {
                    include: /assets/
                }
            }
        }
    ]
};