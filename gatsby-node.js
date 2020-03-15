const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const withDefault = require('./utils/defaul-options');
const { slugify } = require('./utils/helper');

exports.onPreBootstrap = ({ store }, options) => {
    const { program } = store.getState();
    const { contentPath } = withDefault(options);
    const dir = path.join(program.directory, contentPath);

    if(!fs.existsSync(dir)) {
        mkdirp.sync(dir);
    }
};

exports.createSchemaCustomization = ({ actions, schema }, options) => {
    const { itemAttributes, categoryAttributes } = withDefault(options);
    const typeDefs = [
        schema.buildObjectType({
            name: 'ItemAttributes',
            fields: { ...itemAttributes },
            extensions: {
                infer: true,
            },
        }),
        schema.buildObjectType({
            name: 'CategoryAttributes',
            fields: { ...categoryAttributes },
            extensions: {
                infer: true,
            },
        }),
        schema.buildObjectType({
            name: 'Item',
            fields: {
                id: 'ID!',
                recordId: 'String!',
                sku: 'String!',
                name: 'String!',
                slug: 'String!',
                price: 'Float!',
                categories: '[String]',
                attributes: 'ItemAttributes',
            },
            interfaces: ['Node'],
            extensions: {
                infer: false,
            },
        }),
        schema.buildObjectType({
            name: 'Category',
            fields: {
                id: 'ID!',
                recordId: 'String!',
                name: 'String!',
                slug: 'String!',
                items: '[String]',
                attributes: 'CategoryAttributes',
            },
            interfaces: ['Node'],
            extensions: {
                infer: false,
            },
        }),
    ];

    actions.createTypes(typeDefs);
};

exports.onCreateNode = ({ node, actions, createNodeId }, options) => {
    // TODO handle different data source.
    if(node.internal.type !== 'Airtable') {
        return;
    }

    if(node.table === 'Items') {
        actions.createNode({
            id: createNodeId(`item-${node.id}`),
            recordId: node.recordId,
            name: node.data.name,
            price: node.data.price,
            sku: node.data.sku,
            slug: slugify(node.data.name),
            attributes: { ...node.data },
            categories: node.data.categories || [],
            internal: {
                type: 'Item',
                contentDigest: node.internal.contentDigest,
            }
        });
    }

    if(node.table === 'Categories') {
        actions.createNode({
            id: createNodeId(`category-${node.id}`),
            recordId: node.recordId,
            name: node.data.name,
            slug: slugify(node.data.name),
            attributes: { ...node.data },
            items: node.data.items || [],
            internal: {
                type: 'Category',
                contentDigest: node.internal.contentDigest,
            }
        });
    }
};