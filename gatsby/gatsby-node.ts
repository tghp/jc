import { GatsbyNode, graphql } from 'gatsby';
import path from 'path'

import {
    categoryPageSlug,
    getPostPath
} from './src/model/post'

export const createPages: GatsbyNode['createPages'] = async (
    { graphql, actions }
) => {
    const { createPage, createRedirect } = actions;

    const wordpressData = await graphql<Queries.GatsbyNodeDataQuery>(`
        query GatsbyNodeData {
            posts: allWpPost(sort: { fields: [date] }) {
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
            
            pages: allWpPage {
                nodes {
                    slug
                }
            }
            
            categories: allWpCategory {
                nodes {
                    id
                    slug
                }
            }
        }
    `)

    if (wordpressData.data) {
        const {
            posts,
            pages,
            categories,
        } = wordpressData.data

        /**
         * Create post pages
         */
        if (posts.nodes) {
            posts.nodes.forEach((
                { slug, date, content, categories, tghpjcFurtherReadingPosts, tghpjcPdfUrl }
            ) => {
                const postPath = getPostPath(slug, date);
                const postCategories = categories?.nodes?.map(item => item?.slug) || [];
                const furtherReadingPosts = tghpjcFurtherReadingPosts ? tghpjcFurtherReadingPosts.map(item => Number(item)) : [0];
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

        if (pages && pages.nodes) {
            pages.nodes.forEach(({ slug }) => {
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

        if (categories && categories.nodes) {
            categories.nodes.forEach(({ id, slug }) => {
                console.log(`🥃🏠️ Creating category gatsby page for ${slug}`);

                createPage({
                    path: `/${categoryPageSlug}/${slug}/`,
                    component: path.resolve(`./src/templates/category-page.js`),
                    context: { id },
                })

                console.log('🥃🏠️ ✅');
            })
        }

        createRedirect({
            fromPath: `/pdf/*`,
            toPath: 'https://jc.gatspress.com/pdf/*',
            isPermanent: true,
        });
    }
}