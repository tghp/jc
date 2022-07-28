import React from "react"

const SubscribeButton = ({ show }) => {
    return <button
        onClick={show}
        type="button"
        className="subscribe-button">Subscribe</button>
}

export default SubscribeButton