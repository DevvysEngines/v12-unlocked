import terser from '@rollup/plugin-terser';

export default {
  input: 'engine/engine.js',
  output: [
    // Normal readable build
    {
      file: 'dist/engine.js',
      format: 'es',
      sourcemap: true
    },
    // Minified build
    {
      file: 'dist/engine.min.js',
      format: 'es',
      sourcemap: true,
      plugins: [
        terser({
          compress: {
            passes: 3,
            drop_console: true,
            pure_getters: true,
            // unsafe removed for safety
          },
          mangle: {
            toplevel: true,
          },
          format: {
            comments: false,
          }
        })
      ]
    }
  ]
};