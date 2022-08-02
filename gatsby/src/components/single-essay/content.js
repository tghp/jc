import React from "react"
import parse from 'html-react-parser';
import { Element } from 'domhandler/lib/node';

const Content = ({ content, mainContentMeasureRef, referenceContentRefs }) => {
    let processedReferences = [];

    return (
        <div className="single-essay__main-content" ref={mainContentMeasureRef}>
            {parse(content, {
                replace: (domNode) => {
                    if (domNode instanceof Element && domNode.name === 'sup') {
                        const referenceNumber = domNode.attribs['data-reference-number'];

                        const supProps = {
                            className: 'article-reference'
                        };

                        if (processedReferences.indexOf(referenceNumber) === -1) {
                            supProps.ref = (ref) => {
                                referenceContentRefs.current[domNode.attribs['data-reference-number']] = ref;
                            };
                        }

                        processedReferences.push(referenceNumber);

                        return (
                            <sup {...supProps}>
                                {domNode.children[0].data}
                            </sup>
                        );
                    }
                }
            })}
        </div>
    )
}

export default Content