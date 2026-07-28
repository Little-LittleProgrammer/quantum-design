export default {
    '*.{js,jsx,ts,tsx}': ['prettier --cache --ignore-unknown --write', 'oxlint --fix'],
    '*.{scss,less,styl,html,vue,css}': ['prettier --cache --ignore-unknown --write'],
    '*.md': ['prettier --cache --ignore-unknown --write'],
    '*.vue': ['oxlint --fix'],
    '{!(package)*.json,*.code-snippets,.!(browserslist|npm)*rc}': ['prettier --cache --write--parser json'],
    'package.json': ['prettier --cache --write'],
};
