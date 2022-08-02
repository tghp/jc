import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import ModalContext from "../context/modal-context"
import Header from "./header";
import Footer from "./footer";
import SubscribeButton from "./subscribe-button";
import SubscribeModal from "./subscribe-modal";

import '../styles/main.scss';

const Layout = ({ isHomePage, children, location }) => {
    const {
        wp: {
            generalSettings: { title },
        },
    } = useStaticQuery(graphql`
        query LayoutQuery {
            wp {
                generalSettings {
                    title
                    description
                }
            }
        }
    `)

    /**
     * Add location classes to wrapper
     */
    const globalWrapperClasses = [
        "global-wrapper",
    ]
    location && globalWrapperClasses.push(location)

    /**
     * Modal state
     */
    const [modalState, setModalState] = useState(false);
    const showModal = () => setModalState(true)
    const closeModal = () => setModalState(false)

    return (
        <ModalContext.Provider value={{
            modalState,
            showModal,
            closeModal,
        }}>
            <div className={globalWrapperClasses.join(' ')} data-is-root-path={isHomePage}>
                <Header siteTitle={title} />
                <main className="site-main">
                    {children}
                </main>
                <Footer siteTitle={title} />
                <SubscribeButton />
                <SubscribeModal />
            </div>
        </ModalContext.Provider>
    )
}

export default Layout