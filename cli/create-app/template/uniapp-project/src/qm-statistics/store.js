
import { is_json_string, variableType, extend, get_current_source, get_storage, set_storage } from './utils';

class store {
    constructor() {
        this.mem = {
            mdata: [],
            getLength() {
                return this.mdata.length;
            },
            add(t) {
                this.mdata.push(t);
            },
            clear(t) {
                this.mdata.splice(0, t);
            }
        };
        this.session_id = '';
        this.launchs = [];
        this._state = {};
    }
    getUUID() {
        return (
            `${Date.now()
            }-${Math.floor(1e7 * Math.random())
            }-${Math.random().toString(16).replace('.', '')
            }-${String(31242 * Math.random())
                .replace('.', '')
                .slice(0, 8)}`
        );
    }
    toState(ds) {
        let state = null;
        if (is_json_string(ds)) {
            try {
                state = JSON.parse(ds);
            } catch (err) { }
            this._state = state;
            this.set('distinct_id', this.getUUID());
        } else if (variableType.isObject(ds)) {
            state = ds;
            this._state = state;
            this.set('distinct_id', this.getUUID());
        } else {
            this.set('distinct_id', this.getUUID());
        }
    }

    getFirstId() {
        return this._state.first_id;
    }
    getDistinctId() {
        return this._state.distinct_id;
    }
    getProps() {
        // console.log('this._statethis._statethis._state', this._state);
        return this._state.props || {};
    }
    setProps(newp, isCover) {
        const props = this._state.props || {};
        if (!isCover) {
            extend(props, newp);
            this.set('props', props);
        } else {
            this.set('props', newp);
        }
    }
    change(t, v) {
        this._state[t] = v;
    }
    save() {
        set_storage('uniapp-wx-info', this._state)
    }
    set(storageName, storageValue) {
        let obj = {};
        if (typeof storageName === 'string') {
            obj[storageName] = storageValue;
        } else if (typeof storageName === 'object') {
            obj = storageName;
        }
        this._state = this._state || {};
        for (const i in obj) {
            this._state[i] = obj[i];
        }
        this.save();
    }
    init(sa) {
        const _getData = get_storage('uniapp-wx-info')
        const launchs = get_storage('launchs') || []
        const first_launch = get_storage('firstlaunch')
        if (!first_launch) {
            set_storage('firstlaunch', (new Date()).getTime())
        }
        this.launchs = launchs

        const _find = this.launchs.find((item) => !item.endts);

        if (!_find) {
            const _sid = (new Date()).getTime().toString();
            this.launchs.push({
                sid: _sid,
                startts: (new Date()).getTime()
            });
            this.session_id = _sid;
            set_storage('launchs', this.launchs)
        } else {
            this.session_id = _find.sid;
        }
        if (_getData) {
            this.toState(_getData);
            sa.set_para({
                first_source: _getData.first_visit_source,
                first_channel: _getData.first_channel || sa.defaultChannel
            });
        } else {
            const firstSource = get_current_source().$scene;
            sa.is_first_launch = true;
            const time = (new Date());
            const visit_time = time.getTime();
            time.setHours(23);
            time.setMinutes(59);
            time.setSeconds(60);
            this.set({
                distinct_id: sa.para.did,
                first_visit_time: visit_time,
                first_visit_day_time: time.getTime(),
                first_visit_source: firstSource,
                first_channel: sa.para.channel
            });
        }
        //  启动
        sa.initialState.storeIsComplete = true;
        sa.checkIsComplete();
    }
}

export default store;
