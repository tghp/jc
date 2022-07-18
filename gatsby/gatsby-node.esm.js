import path from 'path'
import puppeteer from 'puppeteer'
import fs from 'fs'
import { getPostPath } from './src/model/post'

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
    }).then(() => {
        return graphql(`
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
    })
}

export const onPostBuild = async ({ graphql }) => {
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

    await Promise.all(
        posts.nodes.map(
            ({ slug, date }) => printPDF(getPostPath(slug, date)),
        )
    );
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