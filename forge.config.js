const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {
  packagerConfig: {
    asar: true,
    NAME: 'ephemera',
    ignore: [
      '.angular',
      '.vscode',
      '.editorconfig',
      '.env.dev',
      '.gitignore',
      'angular.json',
      'eslint.config.js',
      'forge.config.js',
      'karma.conf.js',
      'package-lock.json',
      'README.md',
      'tsconfig.app.json',
      'tsconfig.json',
      'tsconfig.spec.json'
    ],
    icon: './dist/ephemera/browser/logo'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {}
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
};
