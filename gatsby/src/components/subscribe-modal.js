import React from "react"
import ModalCloseButton from "../assets/modal-close.svg";

const SubscribeModal = ({ show, hide }) => {
    const showClassName = show ? 'subscribe-modal--open' : '';
    const modalClasses = [
        'subscribe-modal',
    ]
    showClassName && modalClasses.push(showClassName)

    return (
        <div className={modalClasses.join(' ')}>
            <div className="subscribe-modal__content">
                <div className="subscribe-modal__content-body">
                    <iframe src="https://jdprts.substack.com/embed" width="480" height="320" frameBorder="0" scrolling="no" title="jc-subscribe-form" />
                </div>
                <button className="subscribe-modal__content-close">
                    <ModalCloseButton onClick={hide} />
                </button>
            </div>
        </div>
    )
}

export default SubscribeModal