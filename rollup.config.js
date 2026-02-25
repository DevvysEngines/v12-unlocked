import terser from '@rollup/plugin-terser';

export default {
  input: 'engine/engine.js',
  output: {
    file: 'dist/engine.min.js',
    format: 'es',
  },
  plugins: [
    terser({
      compress: {
        passes: 3,
        drop_console: true,
        pure_getters: true,
        unsafe: true,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      }
    })
  ]
};