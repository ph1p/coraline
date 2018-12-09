// rollup.config.js
import { minify } from 'uglify-es';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/cli.js',
  output: {
    file: 'dist/cli.js',
    banner: '#!/usr/bin/env node',
    format: 'cjs'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify({}, minify)
  ]
};
