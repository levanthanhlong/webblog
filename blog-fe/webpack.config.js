const nodeExternals = require('webpack-node-externals');

module.exports = {
  // Cấu hình webpack của bạn
  // ...
  
  // Thêm externals cho node modules
  externals: [nodeExternals()],
  
  // ...
};
