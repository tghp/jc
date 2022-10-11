export const groupHeadings = (index, grouping, headings) => {
    if (index < headings.length) {
        const nextHeading = headings[index]

        if (grouping.length) {
            const prevHeading = grouping.slice().pop()

            try {
                if (nextHeading.depth > prevHeading.depth) {
                    prevHeading.items = prevHeading.items || []
                    return groupHeadings(index, prevHeading.items, headings)
                } else if (nextHeading.depth === prevHeading.depth) {
                    grouping.push({ ...nextHeading })
                    return groupHeadings(++index, grouping, headings)
                } else {
                    const headingErr = new Error('');
                    headingErr.headingData = { index: index, heading: nextHeading };
                    throw headingErr;
                }
            } catch (caughtHeadingErr) {
                const higherHeading = caughtHeadingErr.headingData;
                if (higherHeading.heading.depth === prevHeading.depth) {
                    grouping.push({ ...higherHeading.heading })
                    return groupHeadings(++higherHeading.index, grouping, headings)
                } else {
                    throw caughtHeadingErr
                }
            }
        } else {
            grouping.push({ ...nextHeading })
            groupHeadings(++index, grouping, headings)
        }
    }

    return grouping
}