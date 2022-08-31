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

export const createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    return graphql(`
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
            }
        }
    }
    `).then((result) => {
        result.data.allWpPost.nodes.forEach(({ slug, date, content, categories, tghpjcFurtherReadingPosts }) => {
            const postPath = getPostPath(slug, date);
            const postCategories = categories.nodes.map(item => item.slug)
            const furtherReadingPosts = tghpjcFurtherReadingPosts.map(item => Number(item))
            const references = (content || '').match(/class="article-reference"/g) || [];

            console.log(`🥃🏠️ Creating post gatsby page for ${slug}`);
            console.log(`🥃🏠️ References found: ${references.length}`);

            createPage({
                path: postPath,
                component: path.resolve(`./src/templates/essay.js`),
                context: {
                    slug,
                    postCategories,
                    furtherReadingPosts,
                    downloadFile: `${postPath}.pdf`,
                    referenceCount: references.length,
                },
            });

            console.log('🥃🏠️ ✅');
        })
    }).then(() => graphql(`
        {
            allWpPage {
                nodes {
                    slug
                }
            }
        }
        `).then((result) => {
            result.data.allWpPage.nodes.forEach(({ slug }) => {
                console.log(`🥃🏠️ Creating page gatsby page for ${slug}`);

                createPage({
                    path: `/${slug}/`,
                    component: path.resolve(`./src/templates/page.js`),
                    context: { slug },
                });

                console.log('🥃🏠️ ✅');
            })
        })
    ).then(() => graphql(`
        {
            allWpCategory {
                nodes {
                    id
                    slug
                }
            }
        }
        `).then((result) => {
            result.data.allWpCategory.nodes.forEach(({ id, slug }) => {

                createPage({
                    path: `/${categoryPageSlug}/${slug}/`,
                    component: path.resolve(`./src/templates/category-page.js`),
                    context: { id },
                })
            })
        })
    )
}

export const createSchemaCustomization = ({ actions }) => {
    const { createTypes, createFieldExtension } = actions;

    createFieldExtension({
        name: "content",
        extend: getTableOfContentsFieldExtension,
    })

    const typeDefs = ` 
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