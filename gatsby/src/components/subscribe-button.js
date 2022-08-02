import React, { useContext } from "react"
import ModalContext from "../context/modal-context"

const SubscribeButton = () => {
    const modalContext = useContext(ModalContext)

    return <button
        onClick={modalContext.showModal}
        type="button"
        className="subscribe-button">Subscribe</button>
}

export default SubscribeButton