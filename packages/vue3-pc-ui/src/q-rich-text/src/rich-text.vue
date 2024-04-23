<!-- 动态加载组件 rich-text  -->
<template>
	<div class="q-rich-text" :style="{ width: containerWidth }">
		<textarea
			:id="tinymceId"
			ref="elRef"
			:style="{ visibility: 'hidden' }"
			v-if="canUse && !initOptions.inline"
		></textarea>
		<slot v-else></slot>
	</div>
</template>

<script lang="ts" setup>
	import {
		ref,
		PropType,
		computed,
		unref,
		watch,
		onBeforeUnmount,
		useAttrs,
	} from 'vue';
	import {
        bindHandlers,
		plugins as defaultPlugins,
		toolbar as defaultToolbar,
	} from './tinymce';
	import { isNumber, js_utils_get_uuid } from '@quantum-design/utils';
	defineOptions({
		name: 'RichText',
	});
	let tinymce: any = null;

	const canUse = ref(false);
	import('tinymce/tinymce')
		.then((val) => {
			console.log(val);
			tinymce = val.default || val;
			init_tinymic_plugins();
			canUse.value = true;
		})
		.catch(() => {
			canUse.value = false;
			console.log('skip tinymce');
		});

	function init_tinymic_plugins() {
		import('./lang.js');
		import('tinymce/plugins/anchor');
		import('tinymce/themes/silver');
		import('tinymce/icons/default/icons');
		import('tinymce/plugins/advlist');
		import('tinymce/plugins/autolink');
		import('tinymce/plugins/autosave');
		import('tinymce/plugins/code');
		import('tinymce/plugins/codesample');
		import('tinymce/plugins/directionality');
		import('tinymce/plugins/fullscreen');
		import('tinymce/plugins/hr');
		import('tinymce/plugins/insertdatetime');
		import('tinymce/plugins/link');
		import('tinymce/plugins/lists');
		import('tinymce/plugins/media');
		import('tinymce/plugins/nonbreaking');
		import('tinymce/plugins/noneditable');
		import('tinymce/plugins/pagebreak');
		import('tinymce/plugins/paste');
		import('tinymce/plugins/preview');
		import('tinymce/plugins/print');
		import('tinymce/plugins/save');
		import('tinymce/plugins/searchreplace');
		import('tinymce/plugins/spellchecker');
		import('tinymce/plugins/tabfocus');
		// import 'tinymce/plugins/table';
		import('tinymce/plugins/template');
		import('tinymce/plugins/textpattern');
		import('tinymce/plugins/visualblocks');
		import('tinymce/plugins/visualchars');
		import('tinymce/plugins/wordcount');
	}

	const props = defineProps({
		options: {
			type: Object,
			default: () => {},
		},
		value: {
			type: String,
		},

		toolbar: {
			type: Array as PropType<string[]>,
			default: defaultToolbar,
		},
		plugins: {
			type: Array as PropType<string[]>,
			default: defaultPlugins,
		},
		height: {
			type: [Number, String] as PropType<string | number>,
			required: false,
			default: 400,
		},
		width: {
			type: [Number, String] as PropType<string | number>,
			required: false,
			default: 'auto',
		},
		themeMode: {
			type: String,
			default: 'light',
		},
	});

	const emit = defineEmits([
		'change',
		'update:value',
		'inited',
		'init-error',
	]);

	const tinymceId = ref('tiny-vue' + js_utils_get_uuid(4));

	const elRef = ref<HTMLElement | null>(null);
	const editorRef = ref<any>(null);
	const attrs = useAttrs();
    const fullscreen = ref(false);

	const containerWidth = computed(() => {
		const width = props.width;
		if (isNumber(width)) {
			return `${width}px`;
		}
		return width;
	});
	const skinName = computed(() => {
		return props.themeMode === 'light' ? 'oxide' : 'oxide-dark';
	});
	watch(
		() => canUse.value,
		(val) => {
			if (val) {
				setTimeout(() => {
					initEditor();
				}, 300);
			}
		}
	);

	const initOptions = computed(() => {
		const { height, options, toolbar, plugins } = props;
		return {
			selector: `#${unref(tinymceId)}`,
			height,
			toolbar,
			menubar: 'file edit insert view format table',
			plugins,
			language: 'zh_CN',
			branding: false,
			default_link_target: '_blank',
			link_title: false,
			object_resizing: false,
			skin: skinName.value,
			...options,
			setup: (editor: any) => {
				editorRef.value = editor;
				editor.on('init', (e: any) => initSetup(e));
			},
		};
	});

	function initEditor() {
		const el = unref(elRef);
		if (el) {
			el.style.visibility = '';
		}
		tinymce
			.init(unref(initOptions))
			.then((editor) => {
				console.log(editor, initOptions.value);
				emit('inited', editor);
			})
			.catch((err) => {
				console.log('init-error', err);
				emit('init-error', err);
			});
	}

	function initSetup(e: any) {
		const editor = unref(editorRef);
		if (!editor) {
			return;
		}
		const value = props.value || '';
		editor.setContent(value);
		bindModelHandlers(editor);
        bindHandlers(e, attrs, unref(editorRef));
	}

	function setValue(
		editor: Record<string, any>,
		val?: string,
		prevVal?: string
	) {
		if (
			editor &&
			typeof val === 'string' &&
			val !== prevVal &&
			val !== editor.getContent({ format: attrs.outputFormat })
		) {
			editor.setContent(val);
		}
	}

	function bindModelHandlers(editor: any) {
		const modelEvents = attrs.modelEvents ? attrs.modelEvents : null;
		const normalizedEvents = Array.isArray(modelEvents)
			? modelEvents.join(' ')
			: modelEvents;

		watch(
			() => props.value,
			(val, prevVal) => {
				setValue(editor, val, prevVal);
			},
			{
				immediate: true,
			}
		);

		editor.on(
			normalizedEvents ? normalizedEvents : 'change keyup undo redo',
			() => {
				const content = editor.getContent({
					format: attrs.outputFormat,
				});
				emit('update:value', content);
				emit('change', content);
			}
		);

		editor.on('FullscreenStateChanged', (e) => {
			fullscreen.value = e.state;
		});
	}

	function destory() {
		if (tinymce !== null) {
			tinymce?.remove?.(unref(initOptions).selector!);
		}
	}
	onBeforeUnmount(() => {
		destory();
	});
</script>
<style lang="scss" >
    @import './style/content.min.css';
    @import './style/skin.min.css';
	.q-code-text {
		position: relative;
		line-height: normal;

		textarea {
			visibility: hidden;
			z-index: -1;
		}
	}
</style>
