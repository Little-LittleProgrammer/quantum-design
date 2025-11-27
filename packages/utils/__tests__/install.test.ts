import { describe, it, expect, vi } from 'vitest';
import { component_with_install } from '../src/install';

describe('install.ts', () => {
    describe('component_with_install', () => {
        it('应该为组件添加 install 方法', () => {
            const TestComponent = {
                name: 'TestComponent',
                render() {
                    return 'test';
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent);

            expect(ComponentWithInstall).toBe(TestComponent);
            expect(typeof ComponentWithInstall.install).toBe('function');
        });

        it('应该使用组件的 name 属性注册', () => {
            const TestComponent = {
                name: 'TestComponent',
                render() {
                    return 'test';
                },
            };

            const mockApp = {
                component: vi.fn(),
                config: {
                    globalProperties: {},
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent);
            ComponentWithInstall.install(mockApp);

            expect(mockApp.component).toHaveBeenCalledWith('TestComponent', TestComponent);
        });

        it('应该使用组件的 displayName 属性注册', () => {
            const TestComponent = {
                name: 'InternalName',
                displayName: 'DisplayName',
                render() {
                    return 'test';
                },
            };

            const mockApp = {
                component: vi.fn(),
                config: {
                    globalProperties: {},
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent);
            ComponentWithInstall.install(mockApp);

            // displayName 优先于 name
            expect(mockApp.component).toHaveBeenCalledWith('DisplayName', TestComponent);
        });

        it('应该支持设置别名', () => {
            const TestComponent = {
                name: 'TestComponent',
                render() {
                    return 'test';
                },
            };

            const mockApp = {
                component: vi.fn(),
                config: {
                    globalProperties: {},
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent, '$test');
            ComponentWithInstall.install(mockApp);

            expect(mockApp.component).toHaveBeenCalledWith('TestComponent', TestComponent);
            expect(mockApp.config.globalProperties.$test).toBe(TestComponent);
        });

        it('当组件没有名称时不应该注册', () => {
            const TestComponent = {
                render() {
                    return 'test';
                },
            } as any;

            const mockApp = {
                component: vi.fn(),
                config: {
                    globalProperties: {},
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent);
            ComponentWithInstall.install(mockApp);

            expect(mockApp.component).not.toHaveBeenCalled();
        });

        it('应该保留组件的原始属性', () => {
            const TestComponent = {
                name: 'TestComponent',
                props: {
                    msg: String,
                },
                emits: ['click'],
                setup() {
                    return {};
                },
                render() {
                    return 'test';
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent);

            expect(ComponentWithInstall.name).toBe('TestComponent');
            expect(ComponentWithInstall.props).toEqual({ msg: String });
            expect(ComponentWithInstall.emits).toEqual(['click']);
            expect(ComponentWithInstall.setup).toBe(TestComponent.setup);
            expect(ComponentWithInstall.render).toBe(TestComponent.render);
        });

        it('应该支持 TypeScript 类型', () => {
            interface TestComponentProps {
                message: string;
            }

            const TestComponent = {
                name: 'TestComponent',
                props: {
                    message: String,
                },
                render() {
                    return 'test';
                },
            };

            const ComponentWithInstall = component_with_install<typeof TestComponent>(TestComponent);

            expect(ComponentWithInstall.install).toBeDefined();
            expect(ComponentWithInstall.name).toBe('TestComponent');
        });

        it('应该支持多次安装到不同应用', () => {
            const TestComponent = {
                name: 'TestComponent',
                render() {
                    return 'test';
                },
            };

            const mockApp1 = {
                component: vi.fn(),
                config: { globalProperties: {} },
            };

            const mockApp2 = {
                component: vi.fn(),
                config: { globalProperties: {} },
            };

            const ComponentWithInstall = component_with_install(TestComponent);

            ComponentWithInstall.install(mockApp1);
            ComponentWithInstall.install(mockApp2);

            expect(mockApp1.component).toHaveBeenCalledWith('TestComponent', TestComponent);
            expect(mockApp2.component).toHaveBeenCalledWith('TestComponent', TestComponent);
        });

        it('别名不会覆盖现有的全局属性名称', () => {
            const TestComponent = {
                name: 'TestComponent',
                render() {
                    return 'test';
                },
            };

            const existingGlobal = () => 'existing';
            const mockApp = {
                component: vi.fn(),
                config: {
                    globalProperties: {
                        $existing: existingGlobal,
                    },
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent, '$test');
            ComponentWithInstall.install(mockApp);

            expect(mockApp.config.globalProperties.$test).toBe(TestComponent);
            expect(mockApp.config.globalProperties.$existing).toBe(existingGlobal);
        });

        it('应该正确处理函数式组件', () => {
            // 创建一个带有 name 属性的对象而不是修改函数的 name
            const FunctionalComponent: any = () => 'functional';
            // 使用 Object.defineProperty 来设置 name 属性
            Object.defineProperty(FunctionalComponent, 'name', {
                value: 'FunctionalComponent',
                writable: true,
                configurable: true,
            });

            const mockApp = {
                component: vi.fn(),
                config: { globalProperties: {} },
            };

            const ComponentWithInstall = component_with_install(FunctionalComponent);
            ComponentWithInstall.install(mockApp);

            expect(mockApp.component).toHaveBeenCalledWith('FunctionalComponent', FunctionalComponent);
        });

        it('不使用别名时不应该设置全局属性', () => {
            const TestComponent = {
                name: 'TestComponent',
                render() {
                    return 'test';
                },
            };

            const mockApp = {
                component: vi.fn(),
                config: {
                    globalProperties: {},
                },
            };

            const ComponentWithInstall = component_with_install(TestComponent);
            ComponentWithInstall.install(mockApp);

            expect(Object.keys(mockApp.config.globalProperties)).toHaveLength(0);
        });
    });
});

