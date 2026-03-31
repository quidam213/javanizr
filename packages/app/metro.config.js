const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// Permettre à Metro de voir tous les packages du monorepo
config.watchFolders = [workspaceRoot]

// Résoudre les node_modules depuis l'app EN PREMIER, puis la racine du workspace
// L'ordre est important : React 19 de l'app prime sur React 18 de la racine
config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
]

// Désactiver la recherche hiérarchique (remontée d'arborescence)
// Metro utilisera uniquement nodeModulesPaths dans l'ordre défini ci-dessus
// Cela évite que Metro trouve React 18 dans root/node_modules
// en remontant depuis un fichier situé dans le workspace
config.resolver.disableHierarchicalLookup = true

module.exports = config
