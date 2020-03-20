// const tailwindcss = require("tailwindcss");
const config = require("./tailwind.config");

module.exports = () => ({
    plugins: [require("tailwindcss")(config)],
})