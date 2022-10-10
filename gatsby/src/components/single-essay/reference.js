import React, { useState } from "react"

const Reference = ({ reference, index, referenceSidebarRefs }) => {
    let shortenedText
    const characterCount = 270
    const fullText = reference.text
    const isLongText = fullText.length > characterCount + 20
    if (isLongText) {
        shortenedText = `${fullText.substring(0, characterCount)} ...`
    } else {
        shortenedText = fullText
    }

    const [seeMoreText, setSeeMoreText] = useState(false)
    const setStateHandler = () => setSeeMoreText(!seeMoreText)

    const content = seeMoreText ? fullText : shortenedText

    function jumpToContentRef() {
        document.getElementById(`ref-${index+1}`).scrollIntoView();
    }

    return (
        <div
            className="single-essay__references-item reference"
            key={index}
            ref={ref => referenceSidebarRefs.current[index] = ref}
            style={{
                gridRow: `${(index*2)+2}/${(index*2)+3}`
            }}
            id={`reference-item-${index+1}`}
        >
            <button className="reference__index reference__index--link" onClick={jumpToContentRef}>
                {index+1}
            </button>
            <div className="reference__text" dangerouslySetInnerHTML={{ __html: content }} />
            {isLongText &&
                <button
                    className={`reference__more-link${seeMoreText ? ' reference__more-link--less' : ''}`}
                    onClick={setStateHandler}>
                        {seeMoreText ? 'Less' : 'More'}
                </button>
            }
        </div>
    )
}

export default Reference