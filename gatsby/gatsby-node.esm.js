import { createRemoteFileNode } from 'gatsby-source-filesystem';
import path from 'path'
import { categoryPageSlug, getPostPath } from './src/model/post'
const cheerio = require('cheerio');

export const createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    return graphql(`
    {
        allWpPost(sort: { fields: [date] }) {
            nodes {
                slug
                date
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

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes, createFieldExtension } = actions;

    createFieldExtension({
        name: "content",
        extend: extendContentField,
    })

    const typeDefs = `
    type WpPost implements Node {
      toc: JSON
      content: String @content
      essayPdf: File @link(from: "fields.essayPdfLocalFile")
    }
    
    type WpPage implements Node {
      introPhoto: File @link(from: "fields.pageIntroPhotoLocalFile")
    }
    `

    createTypes(typeDefs)
}

exports.createResolvers = ({ createResolvers, schema }) => {
    createResolvers({
        WpPost: {
            toc: {
                resolve: createTableOfContents,
            },
        },
    })
}

async function createTableOfContents(source, args, context, info) {
    if (source.content) {
        const $ = cheerio.load(source.content)
        const titles = $('h2 ,h3')

        const headings = Array.from(titles).map(title => {
            const depth = parseInt($(title).prop('tagName').substr(1), 10)
            const id = createId($, title)
            return {url: `#${getUniqueId(id)}`, title: $(title).text(), depth}
        })

        const reduced = groupHeadings(0, [], headings)
        return {items: reduced}
    }
}

function extendContentField(options, prevFieldConfig) {
    return {
        resolve(source) {
            if (source.content) {
                const $ = cheerio.load(source.content)
                const titles = $('h2,h3,h4,h5')
                Array.from(titles).forEach(title => {
                    const id = createId($, title)
                    $(title).attr('id', getUniqueId(id))
                })

                return $('body').html()
            }
        },
    }
}

function createId($, title) {
    let id = $(title).attr('id')

    if (!id) {
        id = $(title)
            .text()
            .toLowerCase()
            .replace(/[^a-z_0-9]+/gi, '-')
            .replace(/-+/g, '-')
    }

    return id
}

function getUniqueId() {
    const tempMap = {}
    return el => {
        if (tempMap[el]) {
            tempMap[el] = tempMap[el] + 1
            const result = `${el}-${tempMap[el]}`
            tempMap[result] = 1
            return result
        } else {
            tempMap[el] = 1
            return el
        }
    }
}

function groupHeadings(index, grouping, headings) {
    if (index < headings.length) {
        const nextHeading = headings[index]

        if (grouping.length) {
            const prevHeading = grouping.slice().pop()

            try {
                if (nextHeading.depth > prevHeading.depth) {
                    prevHeading.items = prevHeading.items || []
                    return groupHeadings(index, prevHeading.items, headings)
                } else if (nextHeading.depth === prevHeading.depth) {
                    grouping.push({ ...nextHeading })
                    return groupHeadings(++index, grouping, headings)
                } else {
                    throw { index: index, heading: nextHeading }
                }
            } catch (higherHeading) {
                if (higherHeading.heading.depth === prevHeading.depth) {
                    grouping.push({ ...higherHeading.heading })
                    return groupHeadings(++higherHeading.index, grouping, headings)
                } else {
                    throw higherHeading
                }
            }
        } else {
            grouping.push({ ...nextHeading })
            groupHeadings(++index, grouping, headings)
        }
    }

    return grouping
}

exports.onCreateNode = async ({
    node,
    actions: { createNode, createNodeField },
    createNodeId,
    getCache,
}) => {
    if (node.internal.type === 'WpPage') {
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

    if (node.internal.type === 'WpPost' && process.env.WP_URL) {
        const pdfUrl = `${process.env.WP_URL.trim('/')}/wp-content/uploads/pdf/${node.slug}.pdf`

        const fileNode = await createRemoteFileNode({
            url: pdfUrl,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            getCache,
        })

        // If the file was created, extend the node with "localFile"
        if (fileNode) {
            createNodeField({ node, name: "essayPdfLocalFile", value: fileNode.id })
        }
    }
}