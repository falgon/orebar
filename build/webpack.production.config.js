const webpack = require('webpack');
const entryPath = '../orebar/src/browser/view/docs/';

module.exports = {
    entry: entryPath + 'dash.tsx',
    output: {
	filename: 'main_contents.js',
	path: __dirname + '/' + entryPath,
    },
    devtool: 'source-map',
    resolve: {
	extensions: ['.ts','.tsx','.js',',json']
    },
    module: {
	rules:[
	    { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
	    { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
	]
    },
    plugins:[
	new webpack.DefinePlugin({
	    'process.env.NODE_ENV': JSON.stringify('production')
	}),
	new webpack.optimize.UglifyJsPlugin({
	    compress:{
		warnings:false
	    }
	})
    ],
};
