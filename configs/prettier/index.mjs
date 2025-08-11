export default {
    endOfLine: 'auto',
    overrides: [
        {
            files: ['*.json5'],
            options: {
                quoteProps: 'preserve',
                singleQuote: false,
            },
        },
    ],
    plugins: ['prettier-plugin-tailwindcss'],
    printWidth: 500,
    proseWrap: 'never',
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 4,
};
