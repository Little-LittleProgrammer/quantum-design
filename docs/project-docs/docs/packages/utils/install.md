# install 组件安装

当开发完一个组件需要导出的时候, 需要使用此方法来扩展 `install` 方法, 此方法,可以让`vue`识别到并且全局导入

## Usage

```js
import Tag from './src/tag.vue';
import type {TagProps} from './src/tagTypes';

import { component_with_install } from '@q-front-npm/utils';
const QTag = component_with_install(Tag);

export type {TagProps};
export default QTag;

```