const config = {
    iconPath: __dirname + '/../orebar/node_modules/react-icons'
};

module.exports = {
    target: 'electron',
    entry: '../orebar/src/render/dash.tsx',
    output: {
	filename: 'main_contents.js',
	path: __dirname + '/../orebar/src/render'
    },
    devtool: 'source-map',
    resolve: {
	extensions: ['.ts','.tsx','.js','.json']
    },
    module:{
	rules:[
	    { test: /\.tsx?$/, loader: "awesome-typescript-loader", exclude: /node_modules/ },
	    { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
	],
	loaders: [
	    { exclude: /node_modules/ }
	]
    },
    externals:{
	"react": "React",
	"react-dom": "ReactDOM"
    },
};