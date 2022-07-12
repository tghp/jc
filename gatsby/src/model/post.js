export const getPostPath = (slug, date) => {
    const postDate = new Date(date);
    const postMonth = String(postDate.getMonth() + 1);
    const postDay = String(postDate.getDate());

    return `${postDate.getFullYear()}/${postMonth.padStart(2, '0')}/${postDay.padStart(2, '0')}/${slug}`;
}