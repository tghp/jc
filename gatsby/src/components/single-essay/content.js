import React from "react"
import parse from 'html-react-parser'

const Content = ({
    content,
    hasReferences,
    mainContentMeasureRef,
    referenceContentRefs
}) => {
    let processedReferences = [];

    return (
        <div className="single-essay__main-content" ref={mainContentMeasureRef}>
            {!hasReferences &&
                <div dangerouslySetInnerHTML={{ __html: content }} />
            }
            {hasReferences &&
                <div>
                    {parse(content, {
                        replace: domNode => {

                            if (domNode.name === 'sup') {
                                const referenceNumber = domNode.attribs['data-reference-number'];

                                if (!referenceNumber) {
                                    return
                                }

                                const supProps = {
                                    className: 'article-reference',
                                    id: `ref-${referenceNumber}`
                                };

                                if (processedReferences.indexOf(referenceNumber) === -1) {
                                    supProps.ref = (ref) => {
                                        referenceContentRefs.current[domNode.attribs['data-reference-number']] = ref;
                                    };

                                    processedReferences.push(referenceNumber);
                                }

                                function jumpToSidebarRef() {
                                    document.getElementById(`reference-item-${referenceNumber}`).scrollIntoView();
                                }

                                return (
                                    <sup {...supProps}>
                                        <button onClick={jumpToSidebarRef}>
                                            {domNode.children[0].data}
                                        </button>
                                    </sup>
                                );
                            }
                        }
                    })}
                </div>
            }
        </div>
    )
}

export default Content