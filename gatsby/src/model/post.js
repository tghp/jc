export const categoryPageSlug = 'category'

export const getPostPath = (slug, date) => {
    const postDate = getDates(date)
    return `/${getPostDateFullYear(postDate.newDate)}/${postDate.month.padStart(2, '0')}/${postDate.day.padStart(2, '0')}/${slug}`;
}

export const getPostDate = (date) => {
    const postDate = getDates(date)
    return `${postDate.month.padStart(2, '0')}.${postDate.day.padStart(2, '0')}.${getPostDateFullYear(postDate.newDate)}`;
}

export const getPostDateMonthDay = (date) => {
    const postDate = getDates(date)
    return `${postDate.month.padStart(2, '0')}/${postDate.day.padStart(2, '0')}`;
}

export const getPostDateFullYear = (date) => new Date(date).getFullYear()

function getDates(date) {
    const newDate = new Date(date);
    const postDay = String(newDate.getDate());
    const postMonth = String(newDate.getMonth() + 1);

    return { day: postDay, month: postMonth, newDate: newDate }
}

export const getFavouritePosts = (postIds, allPosts) => {
    const favouritesObject = postIds
        .map((id, idx) => ({ id: Number(id), order: idx+1 }))

    return allPosts
        .filter(post => favouritesObject.find(item => item.id === post.databaseId))
        .map(post => {
            const item = favouritesObject.find(item => item.id === post.databaseId)
            return {
                ...post,
                order: item.order
            }
        })
        .sort((postA, postB) => postA.order - postB.order);
}

export const getFilteredCategoriesWithSelectedPosts = (selectedCategories, allCategories, allPosts) => {
    const categories = selectedCategories
        .map((category, idx) => ({ ...category, menuOrder: idx }))

    const filteredCategories = allCategories
        .filter(category => categories.find(item => parseInt(item.id) === category.databaseId))
        .map(category => {
            const item = categories.find(item => parseInt(item.id) === category.databaseId)
            return {
                ...category,
                menuOrder: item.menuOrder
            }
        })
        .sort((catA, catB) => catA.menuOrder - catB.menuOrder)

    return filteredCategories
        .map(category => {
            const posts = category.tghpjcCategoryHomePosts.map(item => {
                return allPosts.find(post => post.databaseId === parseInt(item))
            })
            return {
                ...category,
                posts: posts
            }
        })
}