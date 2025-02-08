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
		type PropType,
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
    async function load_tinymic() {
		try {
			const val = await import('tinymce/tinymce');
			tinymce = val.default || val;
			await init_tinymic_plugins();
			canUse.value = true;
		} catch (error) {
			canUse.value = false;
			console.log('skip tinymce');
		}
	}
	load_tinymic();
	function init_tinymic_plugins() {
		try {
            import('./lang.js').catch(() => {});
            import('tinymce/plugins/anchor').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/themes/silver').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/icons/default/icons').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/advlist').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/autolink').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/autosave').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/code').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/codesample').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/directionality').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/fullscreen').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/hr').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/insertdatetime').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/link').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/lists').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/media').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/nonbreaking').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/noneditable').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/pagebreak').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/paste').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/preview').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/print').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/save').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/searchreplace').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/spellchecker').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/tabfocus').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            // import 'tinymce/plugins/table';
            import('tinymce/plugins/template').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/textpattern').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/visualblocks').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/visualchars').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
            import('tinymce/plugins/wordcount').catch(() => {
                canUse.value = false;
                console.log('skip tinymce');
            });
		} catch (error) {
			canUse.value = false;
			console.log('skip tinymce');
		}
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
