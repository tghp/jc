import { createRemoteFileNode } from 'gatsby-source-filesystem';
import path from 'path'
import puppeteer from 'puppeteer'
import fs from 'fs'
import { categoryPageSlug, getPostPath } from './src/model/post'
const cheerio = require('cheerio');

export const createPages = ({ graphql, actions }) => {
    const { createPage } = actions

    return graphql(`
    {
        allWpPost(sort: { fields: [date] }) {
            nodes {
                title
                excerpt
                content
                slug
                date
            }
        }
    }
    `).then((result) => {
        result.data.allWpPost.nodes.forEach(({ slug, date }) => {
            const postPath = getPostPath(slug, date);

            createPage({
                path: postPath,
                component: path.resolve(`./src/templates/essay.js`),
                context: {
                    slug,
                    downloadFile: `${postPath}.pdf`,
                },
            })
        })
    }).then(() => graphql(`
        {
            allWpPage {
                nodes {
                    title
                    content
                    slug
                    date
                }
            }
        }
        `).then((result) => {
            result.data.allWpPage.nodes.forEach(({ slug }) => {

                createPage({
                    path: `/${slug}/`,
                    component: path.resolve(`./src/templates/page.js`),
                    context: { slug },
                })
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

export const onPostBuild = async ({ graphql }) => {
    console.log(process.env);

    const { data: { posts } } = await graphql(`
    query {
      posts: allWpPost(sort: { fields: [date] }) {
        nodes {
          slug
          date
        }
      }
    }
  `);

    for (const post of posts.nodes) {
        const { slug, date } = post

        console.log(`🥃🏠️ Creating PDF for post ${slug}`)
        await printPDF(getPostPath(slug, date))
        console.log('🥃🏠️ ✅')
    }
};

const printPDF = async (pageName) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const htmlPath = path.join(
        __dirname,
        'public',
        pageName,
        'index.html',
    );
    const contentHtml = fs.readFileSync(htmlPath, 'utf8');

    await page.setContent(contentHtml);

    await page.pdf({
        format: 'A4',
        margin: {
            top: '1.5cm',
            left: '1.2cm',
            right: '1.2cm',
            bottom: '1.5cm',
        },
        path: path.join(
            __dirname,
            'public',
            `${pageName}.pdf`,
        ),
    });

    await browser.close();
}

exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes, createFieldExtension } = actions;
    createFieldExtension({
        name: "content",
        extend: extendContentField,
    });

    const typeDefs = `
    type WpPost implements Node {
      toc: JSON
      content: String @content
    }
    
    type WpPage implements Node {
      introPhoto: File @link(from: "fields.localFile")
    }
  `;
    createTypes(typeDefs);
}

exports.createResolvers = ({ createResolvers, schema }) => {
    createResolvers({
        WpPost: {
            toc: {
                resolve: createTableOfContents,
            },
        },
    });
}

async function createTableOfContents(source, args, context, info) {
    if (source.content) {
        const $ = cheerio.load(source.content)
        const titles = $('h2 ,h3')
        const getUniqueId = UniqueId()

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
                const getUniqueId = UniqueId()
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

function UniqueId() {
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
                createNodeField({ node, name: "localFile", value: fileNode.id })
            }
        }
    }
}