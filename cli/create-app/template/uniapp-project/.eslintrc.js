const path = require('path')
module.exports = {
    extends: [
        'eslint-config-ali/vue',
        'plugin:import/recommended'
    ],
    rules: {
        eqeqeq: 0,
        'max-len': 0,
        'no-nested-ternary': 0,
        radix: 0,
        indent: [2, 4, { SwitchCase: 1 }],
        quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }], // 使用单引号
        'comma-dangle': [2, 'never'], // 在定义对象或数组时，最后一项不能加逗号
        'comma-spacing': [2, { before: false, after: true }], // 在写逗号时，逗号前面不需要加空格，而逗号后面需要添加空格
        'comma-style': [2, 'last'],
        'no-console': 'off',
        'no-await-in-loop': 'off',
        'no-useless-return': 'off',
        'no-case-declarations': 'off'
    },
    globals: {
        uni: true,
        wx: true,
    },
    settings: {
        "import/resolver": {
            "alias": {
                "map": [
                    ['@', path.resolve(__dirname,'./src')] 
                ],
                "extensions": [".js", ".jsx",".vue"]
            }
        }, 
        "import/extensions": [ ".js", ".jsx", ".ts", ".tsx", ".css"]
    }
}
