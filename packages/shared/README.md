# @quantum-design/shared

目的: 为所有项目提供除工具类外, 要共享的文件, 本意是不用额外再次打包

shared  
├─ color // 颜色处理工具集 │ ├─ convert.ts // 颜色转换，将任意格式颜色转换为HSL格式 │ ├─ generator.ts // 颜色变量生成器，基于主色生成一系列色阶变量，并生成css变量 │ └─ index.ts // 颜色处理工具集 ├─ enums // 公共枚举常量 │ ├─ components.ts  
│ ├─ dateEnum.ts  
│ ├─ dom.ts  
│ ├─ enums.ts  
│ ├─ httpEnum.ts  
│ ├─ memorialEnum.ts  
│ └─ regEnum.ts  
├─ CHANGELOG.md  
├─ README.md  
├─ package.json  
├─ rolldown.config.mjs  
└─ tsconfig.json
