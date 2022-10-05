import React from "react"
import { useSiteMetadata } from "../hooks/use-site-metadata"
import { Helmet } from "react-helmet"

export const MetaData = ({ title, description, image, url }) => {
    const {
        title: defaultTitle,
        description: defaultDescription,
        siteUrl: defaultSiteUrl,
        favicon: defaultImage,
    } = useSiteMetadata()

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: image || defaultImage,
        url: url || defaultSiteUrl,
    }

    return (
        <Helmet
            title={seo.title}
            titleTemplate={`%s - ${defaultTitle}`}
            meta={[
                {
                    name: `description`,
                    content: seo.description
                },
                {
                    name: `image`,
                    content: seo.image
                },
                {
                    name: `og:title`,
                    content: ''
                },
                {
                    name: `og:description`,
                    content: seo.description
                },
                {
                    name: `og:url`,
                    content: seo.url
                },
                {
                    name: `og:image`,
                    content: seo.image
                },
                {
                    name: `twitter:card`,
                    content: `summary_large_image`
                },
                {
                    name: `twitter:title`,
                    content: seo.title
                },
                {
                    name: `twitter:url`,
                    content: seo.url
                },
                {
                    name: `twitter:description`,
                    content: seo.description
                },
                {
                    name: `twitter:image`,
                    content: seo.image
                },
                {
                    name: `google-site-verification`,
                    content: `0Fc_5Il-Vrl96Q3nufFCYOIuYzKbxAfxgBNhOR6ZbGw`
                },
            ]}
        />
    )
}