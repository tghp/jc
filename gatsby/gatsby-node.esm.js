import path from 'path'
import {
    categoryPageSlug,
    getPostPath
} from './src/model/post'
import {
    createTableOfContents,
    getTableOfContentsFieldExtension
} from './src/model/toc'
const { createRemoteFileNode } = require(`gatsby-source-filesystem`) // For some reason `import { createRemoteFileNode } from 'gatsby-source-filesystem'` doesn't work

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
                    tghpjcPdfUpload {
                        url
                    }
                }
            }
        }
    `)

    if (posts && posts.data && posts.data.allWpPost && posts.data.allWpPost.nodes) {
        posts.data.allWpPost.nodes.forEach((
            { slug, date, content, categories, tghpjcFurtherReadingPosts, tghpjcPdfUpload }
        ) => {
            const postPath = getPostPath(slug, date);
            const postCategories = categories.nodes.map(item => item.slug)
            const furtherReadingPosts = tghpjcFurtherReadingPosts.map(item => Number(item))
            const references = (content || '').match(/class="article-reference"/g) || [];
            const latexElements = (content || '').match(/\[latex\]/gi) || [];

            console.log(`🥃🏠️ Creating post gatsby page for ${slug}`);
            console.log(`🥃🏠️ References found: ${references.length}`);

            const hasPdf = tghpjcPdfUpload && tghpjcPdfUpload[0] && tghpjcPdfUpload[0].url;

            if (hasPdf) {
                console.log(`🥃🏠️ ↪️ Creating post PDF redirect for ${slug}`);

                createRedirect({
                    fromPath: `${postPath}/pdf/`,
                    toPath: tghpjcPdfUpload[0].url,
                    isPermanent: true,
                    redirectInBrowser: true,
                });

                console.log(`🥃🏠️ ↪️  ${postPath}/pdf/ -> ${tghpjcPdfUpload[0].url}`);
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
    
    type WpPage implements Node {
      introPhoto: File @link(from: "fields.pageIntroPhotoLocalFile")
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

export const onCreateNode = async ({
    node,
    actions: { createNode, createNodeField },
    createNodeId,
    getCache,
}) => {
    if (node.internal.type === 'WpPage') {
        console.log(`🥃🏠️ [Node ${node.slug}] Adding file node for tghpjcIntroPhoto`)

        if (node.tghpjcIntroPhoto.url !== null) {
            const fileNode = await createRemoteFileNode({
                url: node.tghpjcIntroPhoto.url,
                parentNodeId: node.id,
                createNode,
                createNodeId,
                getCache,
            })

            // If the file was created, extend the node with "localFile"
            if (fileNode) {
                createNodeField({ node, name: "pageIntroPhotoLocalFile", value: fileNode.id })
            }
        }
    }
}