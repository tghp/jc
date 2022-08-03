import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { request, gql } from 'graphql-request'
import { join, dirname } from 'path'
import { config } from 'dotenv'

config({
    path: process.cwd() + '/.env',
});

let browser;

const printPDF = async (slug, url) => {
    // Start a headless browser
    if (!browser) {
        const puppeteerOptions = {
            headless: true,
            pipe: true,
            args: [
                '--disable-gpu',
                '--no-sandbox',
                '--disable-extensions'
            ],
        }

        if (process.env.CHROME_PATH) {
            puppeteerOptions.executablePath = process.env.CHROME_PATH
        }

        browser = await puppeteer.launch()
    }

    const page = await browser.newPage()

    // Goto the provided URL
    await page.goto(url, { waitUntil: 'networkidle0' })

    const pdfDirectoryPath = join(
        dirname(process.argv[1]),
        'out',
    )

    try {
        await mkdir(pdfDirectoryPath, {recursive: true});
    } catch (e) {
        // Directory exists
    }

    // Create the PDF and output it
    const pdfFilePath = join(
        pdfDirectoryPath,
        `${slug}.pdf`,
    )

    await page.pdf({
        format: 'A4',
        margin: {
            top: '1.5cm',
            left: '1.2cm',
            right: '1.2cm',
            bottom: '1.5cm',
        },
        path: pdfFilePath,
    })

    console.log(`🥃🏠️ Successfully created PDF at ${pdfFilePath}`)

    return pdfFilePath
}

(async () => {

    if(!process.env.WP_GRAPHQL_URL) {
        throw 'Missing env variable WP_GRAPHQL_URL'
    }

    if(!process.env.GATSBY_CLOUD_BUILD_WEBHOOK_URL) {
        throw 'Missing env variable GATSBY_CLOUD_BUILD_WEBHOOK_URL'
    }

    const postId = parseInt(process.argv.slice(2))

    // Generate PDF for specific post or all posts
    if (postId) {
        // Generate PDF for specific post
        console.log(`🥃🏠️ Creating PDF for post ID ${postId}`)

        const { post: { slug, uri }} = await request(
            process.env.WP_GRAPHQL_URL,
            gql`
                query ($postId: ID!) {
                    post(id: $postId, idType: DATABASE_ID) {
                        slug
                        uri
                    }
                }
            `,
            { postId }
        )

        await printPDF(slug, `${process.env.WP_BASE_URL}${uri}`)
        await browser.close()
    } else {
        // Generate PDF for all posts
        console.log('🥃🏠️ Creating PDF for all posts')

        const { posts: { nodes: allPosts } } = await request(
            process.env.WP_GRAPHQL_URL,
            gql`
                query {
                    posts (last: 99999) {
                        nodes {
                            databaseId
                            slug
                            uri
                        }
                    }
                }
            `,
            { postId }
        )

        for (const post of allPosts) {
            console.log(`🥃🏠️ Creating PDF for post ${post.databaseId}`)
            await printPDF(post.slug, `${process.env.WP_BASE_URL}${post.uri}`)
        }
        await browser.close()
    }

    console.log('🥃🏠️ ✅')
})();