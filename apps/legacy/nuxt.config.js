const { ModuleFederationPlugin } = require('webpack').container
const path = require('path')
const { getExposes } = require('./modules/federation/getExposes')

export default {
  // Disable server-side rendering for Module Federation
  ssr: false,

  // Target static for S3 deployment
  target: 'static',

  // Global page headers
  head: {
    title: 'Legacy Nuxt 2 App',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Legacy Nuxt 2 Application' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Router configuration
  router: {
    base: '/_legacy/',
    // Exclude .federation.js files from route generation
    extendRoutes(routes) {
      const filtered = routes.filter(route => {
        const isFederationConfig = route.name?.includes('.federation') ||
                                    route.path?.includes('.federation')
        return !isFederationConfig
      })
      routes.splice(0, routes.length, ...filtered)
    }
  },

  // Global CSS
  css: [],

  // Plugins to run before rendering page
  plugins: [
    // Polyfill for installComponents (needed for Module Federation)
    { src: '~/plugins/install-components-polyfill.js', mode: 'client' }
  ],

  // Disable auto import components - we manually import in remote-entries
  // This prevents the installComponents issue when loading via Module Federation
  components: false,

  // Modules for dev and build
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],

  // Modules
  modules: [
    // Auto-generate Web Component wrappers from federation.config.js
    '~/modules/federation'
  ],

  // Tailwind CSS configuration
  tailwindcss: {
    configPath: './tailwind.config.js',
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: false
  },

  // Build Configuration
  build: {
    publicPath: '/_legacy/_nuxt/',

    postcss: {
      postcssOptions: {
        plugins: {
          tailwindcss: {},
          autoprefixer: {}
        }
      }
    },

    transpile: [],
    extractCSS: true,

    // Use predictable CSS filename (no hash) for Module Federation
    // This allows remote-entries to reference CSS without knowing the hash
    filenames: {
      css: () => 'css/legacy-styles.css'
    },

    // Webpack 5 configuration with Module Federation
    extend(config, { isDev, isClient }) {
      // Fix webpack 5 incompatible options
      // Remove futureEmitAssets (webpack 4 only)
      if (config.output && config.output.futureEmitAssets !== undefined) {
        delete config.output.futureEmitAssets
      }

      // Fix splitChunks.cacheGroups.commons.name (webpack 5 requires false, string, or function)
      if (config.optimization?.splitChunks?.cacheGroups?.commons?.name === true) {
        config.optimization.splitChunks.cacheGroups.commons.name = false
      }

      // Fix devtool - Webpack 5 requires strict pattern matching
      // Nuxt 2 may set invalid devtool values like '@cheap-module-source-map'
      if (config.devtool && typeof config.devtool === 'string') {
        // Remove @ prefix and normalize to valid webpack 5 devtool
        const devtool = config.devtool.replace(/^@/, '')
        // Map to valid webpack 5 devtool values
        if (devtool.includes('source-map')) {
          config.devtool = isDev ? 'eval-cheap-module-source-map' : 'source-map'
        }
      }

      // Fix webpack 5 module resolution for ESM packages
      config.module.rules.push({
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      })

      if (isClient) {
        // Configure Module Federation with library type 'window' to expose global
        // Using 'window' ensures the container is accessible as window.legacyApp
        // Get exposes from federation.config.js (auto-generated wrappers)
        const exposes = getExposes(__dirname)
        console.log('[Federation] Module exposes:', Object.keys(exposes))

        config.plugins.push(
          new ModuleFederationPlugin({
            name: 'legacyApp',
            library: { type: 'window', name: 'legacyApp' },
            filename: 'remoteEntry.js',
            exposes,
            // Don't share Vue - each app has its own Vue instance
            // This prevents Vue 2/3 conflicts
            shared: {},
            // Include the runtime in the remoteEntry so it's self-contained
            runtime: false
          })
        )

        // Ensure proper output for federation
        // Both dev and prod serve from /_legacy/_nuxt/
        // In dev: Shell's Vite proxy forwards requests to legacy dev server
        // In prod: Files are served directly from S3
        config.output = {
          ...config.output,
          publicPath: '/_legacy/_nuxt/',
          uniqueName: 'legacyApp'
        }

        // Disable runtime chunk splitting so remoteEntry.js is self-contained
        config.optimization = {
          ...config.optimization,
          runtimeChunk: false
        }

        // Add aliases for remote entries
        config.resolve.alias['~'] = path.resolve(__dirname)
        config.resolve.alias['@'] = path.resolve(__dirname)
      }

      // Fix unfetch resolution for webpack 5 (exports field not properly supported)
      config.resolve.alias['unfetch'] = path.resolve(__dirname, 'node_modules/unfetch/dist/unfetch.js')

      // Fix Node.js core module polyfills for webpack 5
      // Webpack 5 no longer includes polyfills for node.js core modules by default
      config.resolve.fallback = {
        ...config.resolve.fallback,
        url: false,
        path: false,
        fs: false,
        stream: false,
        crypto: false,
        buffer: false,
        util: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        zlib: false
      }
    }
  },

  // Generate configuration for static export
  generate: {
    dir: 'dist',
    fallback: true
  },

  // Development server configuration
  server: {
    port: 3001,
    host: '0.0.0.0'
  },

  // Loading indicator
  loading: {
    color: '#3B82F6',
    height: '3px'
  },

  // Telemetry
  telemetry: false
}
