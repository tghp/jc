import path from 'path'
import {
    categoryPageSlug,
    getPostPath
} from './src/model/post'
import {
    createTableOfContents,
    getTableOfContentsFieldExtension
} from './src/model/toc'

export const createPages = async ({ graphql, actions }) => {
    const { createPage, createRedirect } = actions

    /**
     * Create post pages
     */

    const posts = await graphql(`
        {
            allWpPost(sort: { fields: [date] }) {
                nodes {
                    slug
                    date
                    content
                    categories {
                        nodes {
                            slug
                        }
                    }
                    tghpjcFurtherReadingPosts
                    tghpjcPdfUrl
                }
            }
        }
    `)

    if (posts && posts.data && posts.data.allWpPost && posts.data.allWpPost.nodes) {
        posts.data.allWpPost.nodes.forEach((
            { slug, date, content, categories, tghpjcFurtherReadingPosts, tghpjcPdfUrl }
        ) => {
            const postPath = getPostPath(slug, date);
            const postCategories = categories.nodes.map(item => item.slug)
            const furtherReadingPosts = tghpjcFurtherReadingPosts ? tghpjcFurtherReadingPosts.map(item => Number(item)) : [0]
            const references = (content || '').match(/class="article-reference"/g) || [];
            const latexElements = (content || '').match(/\[latex\]/gi) || [];

            console.log(`🥃🏠️ Creating post gatsby page for ${slug}`);
            console.log(`🥃🏠️ References found: ${references.length}`);

            const hasPdf = tghpjcPdfUrl;

            if (hasPdf) {
                console.log(`🥃🏠️ ↪️ Creating post PDF redirect for ${slug}`);

                createRedirect({
                    fromPath: `${postPath}/pdf/`,
                    toPath: tghpjcPdfUrl,
                    isPermanent: true,
                    redirectInBrowser: true,
                });

                console.log(`🥃🏠️ ↪️  ${postPath}/pdf/ -> ${tghpjcPdfUrl}`);
            }

            createPage({
                path: postPath,
                component: path.resolve(`./src/templates/essay.js`),
                context: {
                    slug,
                    postCategories,
                    furtherReadingPosts,
                    hasPdf,
                    referenceCount: references.length,
                    latexCount: latexElements.length,
                },
            });

            console.log('🥃🏠️ ✅');
        })
    }

    /**
     * Create page pages
     */

    const pages = await graphql(`
        {
            allWpPage {
                nodes {
                    slug
                }
            }
        }
    `)

    if (pages && pages.data && pages.data.allWpPage && pages.data.allWpPage.nodes) {
        pages.data.allWpPage.nodes.forEach(({ slug }) => {
            console.log(`🥃🏠️ Creating page gatsby page for ${slug}`);

            createPage({
                path: `/${slug}/`,
                component: path.resolve(`./src/templates/page.js`),
                context: { slug },
            });

            console.log('🥃🏠️ ✅');
        })
    }

    /**
     * Create category pages
     */

    const categories = await graphql(`
        {
            allWpCategory {
                nodes {
                    id
                    slug
                }
            }
        }
    `)

    if (categories && categories.data && categories.data.allWpCategory && categories.data.allWpCategory.nodes) {
        categories.data.allWpCategory.nodes.forEach(({ id, slug }) => {
            console.log(`🥃🏠️ Creating category gatsby page for ${slug}`);

            createPage({
                path: `/${categoryPageSlug}/${slug}/`,
                component: path.resolve(`./src/templates/category-page.js`),
                context: { id },
            })

            console.log('🥃🏠️ ✅');
        })
    }
}

export const createSchemaCustomization = ({ actions }) => {
    const { createTypes, createFieldExtension } = actions;

    createFieldExtension({
        name: "content",
        extend: getTableOfContentsFieldExtension,
    })

    const typeDefs = `
    type WpPost implements Node {
      toc: JSON
      content: String @content
    }
    `

    createTypes(typeDefs)
}

export const createResolvers = ({ createResolvers, schema }) => {
    createResolvers({
        WpPost: {
            toc: {
                resolve: createTableOfContents,
            },
        },
    })
}