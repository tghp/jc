import { config } from 'dotenv';
const { getPostPath } = require('./src/model/post');

config({
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
                "url": process.env.WP_GRAPHQL_URL,
                html: {
                    createStaticFiles: false,
                    useGatsbyImage: false,
                },
                type: {
                    MediaItem: { createFileNodes: false },
                },
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
        {
            resolve: 'gatsby-plugin-feed',
            options: {
                query: `
                    {
                        site {
                            siteMetadata {
                                title
                                description
                                siteUrl
                                site_url: siteUrl
                            }
                        }
                    }
                `,
                feeds: [
                    {
                        serialize: ({ query: { site, allWpPost } }) => {
                            return allWpPost.nodes.map(post => {
                                const url = site.siteMetadata.siteUrl + getPostPath(post.slug, post.date);

                                return {
                                    description: post.excerpt,
                                    date: post.date,
                                    url,
                                };
                            })
                        },
                        query: `
                            {
                                allWpPost(
                                    sort: {fields: [date], 
                                    order: DESC}
                                ) {
                                    nodes {
                                        title
                                        slug
                                        date
                                        excerpt
                                    }
                                }
                            }
                        `,
                        output: '/rss.xml',
                        title: `${siteMetaData.title} RSS Feed`,
                    }
                ]
            }
        },
        {
            resolve: 'gatsby-plugin-robots-txt',
            options: {
                host: process.env.GATSBY_SITE_URL,
                env: {
                    development: {
                        policy: [
                            { userAgent: '*', disallow: ['/'] }
                        ]
                    },
                }
            }
        }
    ]
};