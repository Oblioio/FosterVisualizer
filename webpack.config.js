const env = process.env.NODE_ENV || 'development';

function buildConfig(env) {
  return require('./config/webpack.config.' + env + '.js');
}

module.exports = buildConfig(env === 'production' ? 'prod': 'dev');