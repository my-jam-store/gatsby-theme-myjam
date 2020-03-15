module.exports = ({
    basePath = '/',
    contentPath = 'data',
    itemAttributes = { default: { type: "String" } },
    categoryAttributes = { default: { type: "String" } },
    useAirtable = { enabled: false },
}) => ({ basePath, contentPath, itemAttributes, categoryAttributes, useAirtable });