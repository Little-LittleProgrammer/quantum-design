import {
    green
} from 'kolorist';
import { cli_update } from '../questions/update';
import { bin_run_ignore, bin_run_inherit } from './command';
import pkg from '../../package.json';

export async function need_update() {
    try {
        const _string = (bin_run_ignore('npm show qm-ali-cloud versions'))?.replaceAll('\'', '\"');
        if (_string) {
            const _arr = JSON.parse(_string);
            if (_arr || _arr.length > 0) {
                const _newVersion = _arr[_arr.length - 1];
                if (_newVersion !== pkg.version) {
                    const _options = await cli_update(_newVersion, pkg.version);
                    if (_options.isUpdate) {
                        bin_run_inherit('npm update qm-ali-cloud -g');
                        green('update ok');
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    } catch (error) {
        return false;
    }
}
