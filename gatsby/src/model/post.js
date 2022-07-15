export const getPostPath = (slug, date) => {
    const postDate = new Date(date);
    const postMonth = String(postDate.getMonth() + 1);
    const postDay = String(postDate.getDate());

    return `${postDate.getFullYear()}/${postMonth.padStart(2, '0')}/${postDay.padStart(2, '0')}/${slug}`;
}

export const getPostDate = (date) => {
    const postDate = new Date(date);
    const dateDay = String(postDate.getDay());
    const dateMonth = String(postDate.getMonth());

    return `${dateDay.padStart(2, '0')}.${dateMonth.padStart(2, '0')}.${postDate.getFullYear()}`;
}