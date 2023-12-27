const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
	entry: "./src/index.tsx",
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: "bundle.js"
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				use: "ts-loader",
				exclude: /node_modules/
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"] // Hinzufügen dieser Regel, um CSS-Dateien zu behandeln
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(js|jsx)$/,
				use: "babel-loader",
				exclude: /node_modules/
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg)$/,
				type: 'asset/resource' // Hinzufügen dieser Regel, um Schriftartendateien zu handhaben
			}
		]
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: "./public/index.html",
			filename: "./index.html"
		})
	],
	devServer: {
		static: {
			directory: path.join(__dirname, 'public'),
		},
		compress: true,
		port: 9000,
	},
};
