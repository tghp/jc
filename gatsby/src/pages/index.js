import * as React from 'react'
import { graphql } from 'gatsby'
import { getPostPath } from '../model/post';
import Layout from '../components/layout';

// markup
const IndexPage = ({ data: { home, posts } }) => (
  <Layout>
    <title>Home Page</title>
    <h1>{home.title}</h1>
    <ul>
      {posts.nodes.map(({ slug, date, title }) => (
        <li key={slug}>
          <a href={getPostPath(slug, date)}>
            {title}
          </a>
        </li>
      ))}
    </ul>
  </Layout>
);

export const indexQuery = graphql`
  query {
    home: wpPage(uri: { eq: "/" }) {
      title
    }
    posts: allWpPost(sort: { fields: [date] }) {
      nodes {
        title
        excerpt
        slug
        date
      }
    }
  }
`

export default IndexPage
