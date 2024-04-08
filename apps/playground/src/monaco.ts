import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
// import { schemasRootType } from '@qimao/quantum-schemas';

export function install_monaco() {
    window.MonacoEnvironment = {
        getWorker(_: any, label: string) {
            if (label === 'json') {
                return new JsonWorker();
            }
            if (label === 'css' || label === 'scss' || label === 'less') {
                return new CssWorker();
            }
            if (label === 'html' || label === 'handlebars' || label === 'razor') {
                return new HtmlWorker();
            }
            if (label === 'typescript' || label === 'javascript') {
                return new TsWorker();
            }
            return new EditorWorker();
        },
    };

    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
    // monaco.languages.typescript.typescriptDefaults.addExtraLib(schemasRootType);
}
