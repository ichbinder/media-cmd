const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const Dotenv = require('dotenv-webpack');


module.exports = (env, argv) => {
	// argv.mode wird den Wert von --mode haben, der in der Kommandozeile gesetzt wurde.
	const currentEnv = argv.mode || 'development'; // Default zu 'development', falls nicht gesetzt.
	const isProduction = currentEnv === 'production';

	return {
		entry: "./src/index.tsx",
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: "bundle.js"
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js", ".json"],
			fallback: {
				"path": require.resolve("path-browserify")
			}
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
			}),
			new Dotenv({
				path: `./.env.${isProduction ? 'production' : 'development'}`,
			  })
		],
		devServer: {
			static: {
				directory: path.join(__dirname, 'public'),
			},
			compress: true,
			port: 9000,
		},
	}
};
