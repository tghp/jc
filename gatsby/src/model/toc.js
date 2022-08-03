import * as cheerio from 'cheerio';

const createUniqueIdFactory = () => {
    const tempMap = {}

    return el => {
        if (tempMap[el]) {
            tempMap[el] = tempMap[el] + 1
            const result = `${el}-${tempMap[el]}`
            tempMap[result] = 1
            return result
        } else {
            tempMap[el] = 1
            return el
        }
    }
}

const createId = ($, title) => {
    let id = $(title).attr('id')

    if (!id) {
        id = $(title)
            .text()
            .toLowerCase()
            .replace(/[^a-z_0-9]+/gi, '-')
            .replace(/-+/g, '-')
    }

    return id
}

const groupHeadings = (index, grouping, headings) => {
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
                    throw { index: index, heading: nextHeading }
                }
            } catch (higherHeading) {
                if (higherHeading.heading.depth === prevHeading.depth) {
                    grouping.push({ ...higherHeading.heading })
                    return groupHeadings(++higherHeading.index, grouping, headings)
                } else {
                    throw higherHeading
                }
            }
        } else {
            grouping.push({ ...nextHeading })
            groupHeadings(++index, grouping, headings)
        }
    }

    return grouping
}

export const createTableOfContents = async (source, args, context, info) => {
    if (source.content) {
        const $ = cheerio.load(source.content)
        const titles = $('h2 ,h3')
        const getUniqueId = createUniqueIdFactory()

        const headings = Array.from(titles).map(title => {
            const depth = parseInt($(title).prop('tagName').substr(1), 10)
            const id = createId($, title)
            return {url: `#${getUniqueId(id)}`, title: $(title).text(), depth}
        })

        const reduced = groupHeadings(0, [], headings)
        return {items: reduced}
    }
}

export const getTableOfContentsFieldExtension = (options, prevFieldConfig) => {
    return {
        resolve(source) {
            if (source.content) {
                const $ = cheerio.load(source.content)
                const titles = $('h2,h3,h4,h5')
                const getUniqueId = createUniqueIdFactory()

                Array.from(titles).forEach(title => {
                    const id = createId($, title)
                    $(title).attr('id', getUniqueId(id))
                })

                return $('body').html()
            }
        },
    }
}
