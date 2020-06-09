const path = require("path");

const js = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
        {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env", "@babel/preset-react"],
                plugins: ["@babel/plugin-proposal-class-properties", "babel-plugin-styled-components"]
            },
        }
    ],
};

const sass = {
    test: /\.s(a|c)ss$/i,
    use: [
        "style-loader",
        "css-loader",
        "sass-loader"
    ],
};

const css = {
    test: /\.css$/i,
    use: [
        "style-loader",
        "css-loader"
    ],
};

const serverCss = {
    test:  /\.css$/i,
    use: [
        "style-loader",
        {
            loader: 'css-loader',
            options: {
                onlyLocals: true,
            }
        },
    ],
};

const serverSass = {
    test:  /\.s(a|c)ss$/i,
    use: [
        "style-loader",
        {
            loader: 'css-loader',
            options: {
                onlyLocals: true,
            }
        },
        "sass-loader"
    ],
};

const clientConfig = {
    mode: "production",
    target: "web",
    entry: {
        "clientBundle.js": path.resolve(__dirname, "client/src/index.js")
    },
    module: {
        rules: [js, css, sass],
    },
    output: {
        path: path.resolve(__dirname, "dist/public"),
        filename: "[name]"
    },
};

const serverConfig = {
    mode: "production",
    target: "node",
    node: {
        __dirname: false,
    },
    entry: {
        "server.js": path.resolve(__dirname, "./index.js"),
    },
    module: {
        rules: [js, serverCss, serverSass],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name]",
        libraryTarget: "commonjs2"
    }
};


module.exports = [clientConfig, serverConfig];