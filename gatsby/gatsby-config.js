require("dotenv").config({
    path: '.env',
})

const siteMetaData = {
    title: `Joseph Carlsmith`,
    description: `Joseph Carlsmith's Personal Website`,
    siteUrl: process.env.GATSBY_SITE_URL,
    backgroundColor: `#F1EFEF`,
    themeColor:  `#FAF8F8`,
    favicon: `src/images/favicon.png`,
}

module.exports = {
    siteMetadata: siteMetaData,
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
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: siteMetaData.title,
                short_name: siteMetaData.title,
                start_url: `/`,
                background_color: siteMetaData.backgroundColor,
                theme_color: siteMetaData.themeColor,
                display: `standalone`,
                icon: siteMetaData.favicon,
            },
        },
        'gatsby-plugin-offline',
    ]
};