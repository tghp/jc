import React from "react"
import { useSiteMetadata } from "../hooks/use-site-metadata"
import { Helmet } from "react-helmet"

export const MetaData = ({ title, description, pathname, children }) => {
    const { title: defaultTitle, description: defaultDescription } = useSiteMetadata()

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
    }

    return (
        <Helmet
            title={seo.title}
            titleTemplate={`%s | ${defaultTitle}`}
            meta={[
                {
                    name: `description`,
                    content: seo.description
                },
            ]}
        />
    )
}