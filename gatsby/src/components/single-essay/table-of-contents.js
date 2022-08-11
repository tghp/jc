import React, { useState } from "react"
import TocNav from "./table-of-contents-items";

const TableOfContents = ({ navItems }) => {
    const [toggleNav, setToggleNav] = useState(true)
    const handleToggle = () => setToggleNav(!toggleNav)
    const buttonText = toggleNav ? 'hide' : 'show'

    return (
        <>
        {navItems?.length > 0 &&
            <div className="single-essay__sidebar-menu">
                <div className="single-essay__sidebar-menu-title">
                    Contents <button
                        onClick={handleToggle}
                        className="single-essay__sidebar-menu-toggle"
                        type="button">
                        {buttonText}
                    </button>
                </div>
                {toggleNav && <TocNav navItems={navItems} />}
            </div>
        }
        </>
    )
}

export default TableOfContents