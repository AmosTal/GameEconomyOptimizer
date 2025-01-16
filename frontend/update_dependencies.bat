@echo off

REM Babel Plugins - update to transform plugins
call npm install --save-dev ^
  @babel/plugin-transform-private-methods ^
  @babel/plugin-transform-numeric-separator ^
  @babel/plugin-transform-class-properties ^
  @babel/plugin-transform-nullish-coalescing-operator ^
  @babel/plugin-transform-optional-chaining

REM Rollup Terser
call npm uninstall rollup-plugin-terser
call npm install --save-dev @rollup/plugin-terser

REM ESLint Config
call npm uninstall @humanwhocodes/config-array @humanwhocodes/object-schema
call npm uninstall @humanwhocodes/config-array
call npm install --save-dev @eslint/config-array @eslint/object-schema

REM Rimraf
call npm uninstall rimraf
call npm install --save-dev rimraf@4.4.1

REM SVGO
call npm uninstall svgo
call npm install --save-dev svgo@2.8.0

REM ESLint
call npm uninstall eslint
call npm install --save-dev eslint@^8.57.0

REM Sourcemap Codec
call npm uninstall sourcemap-codec
call npm install --save-dev @jridgewell/sourcemap-codec

REM Workbox
call npm uninstall workbox-cacheable-response workbox-google-analytics
call npm install workbox-webpack-plugin

REM Update React Scripts
call npm install react-scripts@latest

REM Update all dependencies
call npm update

REM Run audit fix
call npm audit fix --force

pause
