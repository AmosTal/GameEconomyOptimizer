#!/bin/bash

# Babel Plugins - update to transform plugins
npm install --save-dev \
  @babel/plugin-transform-private-methods \
  @babel/plugin-transform-numeric-separator \
  @babel/plugin-transform-class-properties \
  @babel/plugin-transform-nullish-coalescing-operator \
  @babel/plugin-transform-optional-chaining

# Rollup Terser
npm uninstall rollup-plugin-terser
npm install --save-dev @rollup/plugin-terser

# ESLint Config
npm uninstall @humanwhocodes/config-array @humanwhocodes/object-schema
npm install --save-dev @eslint/config-array @eslint/object-schema

# Rimraf
npm uninstall rimraf
npm install --save-dev rimraf@4.4.1

# SVGO
npm uninstall svgo
npm install --save-dev svgo@2.8.0

# ESLint
npm uninstall eslint
npm install --save-dev eslint@^8.57.0

# Sourcemap Codec
npm uninstall sourcemap-codec
npm install --save-dev @jridgewell/sourcemap-codec

# Workbox
npm uninstall workbox-cacheable-response workbox-google-analytics
npm install workbox-webpack-plugin

# Update React Scripts
npm install react-scripts@latest

# Update all dependencies
npm update

# Run audit fix
npm audit fix --force
