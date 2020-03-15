const withDefault = require('./utils/defaul-options');

module.exports = (options) => {
   const { useAirtable } = withDefault(options);

   return {
       plugins: [
           useAirtable.enabled && {
               resolve: 'gatsby-source-airtable',
               options: { ...useAirtable.options }
           },
       ].filter(Boolean),
   }
};