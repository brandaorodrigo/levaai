import { type FormInstance, Form as FormOriginal, Skeleton } from 'antd';

type FormProps = {
    children: React.ReactNode;
    form: FormInstance<any>;
    onFinish: (values: any) => void;
    loading?: boolean;
};

type FormComponent = React.FC<FormProps> & {
    useForm: typeof FormOriginal.useForm;
    Item: typeof FormOriginal.Item;
};

const Form: FormComponent = ({ children, form, onFinish, loading }) => {
    return (
        <>
            {loading && (
                <Skeleton
                    active
                    paragraph={{ rows: 14, width: '100%' }}
                    style={{ margin: '6px 0 0 0' }}
                    title={false}
                />
            )}
            <FormOriginal
                autoComplete='off'
                form={form}
                layout='vertical'
                onFinish={onFinish}
                style={{ display: loading ? 'none' : 'block' }}
            >
                {children}
            </FormOriginal>
        </>
    );
};

Form.useForm = FormOriginal.useForm;
Form.Item = FormOriginal.Item;

export default Form;
