const config = {
    iconPath: __dirname + '/../oreblr/node_modules/react-icons'
};

module.exports = {
    target: 'electron',
    entry: '../oreblr/src/render/dash.tsx',
    output: {
	filename: 'main_contents.js',
	path: __dirname + '/../oreblr/src/render'
    },
    devtool: 'source-map',
    resolve: {
	extensions: ['.ts','.tsx','.js','.json']
    },
    module:{
	rules:[
	    { test: /\.tsx?$/, loader: 'awesome-typescript-loader', exclude: /node_modules/ },
	    { test: /\.scss?$/, loaders: ['style-loader','css-loader','sass-loader'] },
	    { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
	    { enforce: 'pre', test: /\.tsx?$/, exclude: /node_modules/, loader:'tslint-loader' }
	],
	loaders: [
	    { exclude: /node_modules/ },
	]
    },
    externals:{
	'react': 'React',
	'react-dom': 'ReactDOM'
    },
};
