require("dotenv").config({
    path: '.env',
})

module.exports = {
    siteMetadata: {
        title: `JC`,
        siteUrl: process.env.GATSBY_SITE_URL
    },
    plugins: [
        {
            resolve: 'gatsby-source-wordpress',
            options: {
                "url": process.env.WP_GRAPHQL_URL
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
                wordpressUrl: process.env.WP_URL,
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
        },
        'gatsby-plugin-gatsby-cloud',
    ]
};