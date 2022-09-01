import { withInstall } from '@qmfront/shared/utils';
import Form from './src/form.vue';

export const QForm = withInstall(Form);

export * from './src/types';
export * from './src/props';
export * from './src/types/form';
export * from './src/types/form-item';

export { useComponentRegister } from './src/hooks/use-component-register';
export { useForm } from './src/hooks/use-form';
