import { graphql } from 'gatsby'

export const SeoData = graphql`
    fragment SeoData on WpContentNode {
        seo {
            title
            metaDesc
            focuskw
            metaKeywords
            metaRobotsNoindex
            metaRobotsNofollow
            opengraphTitle
            opengraphDescription
            opengraphImage {
                altText
                sourceUrl
                srcSet
            }
            twitterTitle
            twitterDescription
            twitterImage {
                altText
                sourceUrl
                srcSet
            }
            canonical
            cornerstone
            schema {
                articleType
                pageType
                raw
            }
        }
    }
`