/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

// schemas can be explicitly defined here - otherwise create dummy data in Strapi and Gatsby resolves the rest.
// exports.createSchemaCustomization = ({ actions }) => {
//     const { createTypes } = actions
//     const typeDefs = `
//       type RecipeItem implements Node @dontInfer {
//         name: String!,
//         amount: Int,
//         unit: Unit
//       },
//       enum Unit {
//           kg,
//           g,
//           dl,
//           ml
//       }
//     `
//     createTypes(typeDefs)
//   }