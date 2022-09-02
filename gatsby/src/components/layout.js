import React, { useState } from "react"
import { useStaticQuery, graphql, Script } from "gatsby"
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
     * Subscribe modal state
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
                <Header
                    siteTitle={title}
                    location={location}
                />
                <main className="site-main">
                    {children}
                </main>
                <Footer siteTitle={title} />
                <SubscribeButton />
                <SubscribeModal />
            </div>
            <Script
                id="gtag-config"
                strategy="post-hydrate"
                src="https://www.googletagmanager.com/gtag/js?id=G-R3WSC4KDYY"
                onLoad={() => console.log("[gtag script] successfully loaded")}
                onError={() => console.log("[gtag script] failed to load")} >
                    {`
                        window.dataLayer = window.dataLayer || []; 
                        function gtag(){dataLayer.push(arguments);} 
                        gtag('js', new Date()); 
                        gtag('config', 'G-R3WSC4KDYY');
                    `}
            </Script>
        </ModalContext.Provider>
    )
}

export default Layout