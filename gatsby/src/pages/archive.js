import * as React from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout';

const ArchivePage = () => {

    return (
        <Layout>
            <div className="post-archive">
                <Link to={'/'} className="back-home">
                    Back to homepage
                </Link>
            </div>
        </Layout>
    );
}

export default ArchivePage