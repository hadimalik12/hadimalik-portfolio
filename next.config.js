const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  basePath: isProd ? '/hadimalik-portfolio' : '',
  assetPrefix: isProd ? '/hadimalik-portfolio/' : '',
  trailingSlash: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
};