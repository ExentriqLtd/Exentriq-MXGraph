module.exports = (ctx) => {
  // This flag is set when loading configuration by this package.
  if (ctx.meteor) {
    const config = {
      plugins: {
        'autoprefixer': {
          browsers: [
            'Chrome >= 35',
            'Firefox >= 38',
            'Edge >= 12',
            'Explorer >= 9',
            'iOS >= 8',
            'Safari >= 8',
            'Android 2.3',
            'Android >= 4',
            'Opera >= 12',
          ],
        },
      },
    };
    return config;
  }
  else {
    return {};
  }
};