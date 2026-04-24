import { Select as SelectOriginal, type SelectProps as SelectPropsOriginal } from 'antd';
import { renderToString } from 'react-dom/server';

const tag = (value: string): string => {
    if (!value) {
        return '';
    }
    const fix = value.normalize('NFD').replace(/\p{Diacritic}/gu, '');
    return fix.toLowerCase();
};

const filterOption = (value: any, option: any) => {
    const label = option?.label;
    const string = typeof label === 'object' ? renderToString(label) : String(label);
    const content = `${option?.title} ${string} ${option?.value} ${option?.description}`;
    return tag(content).indexOf(tag(value)) !== -1;
};

type SelectProps = Omit<SelectPropsOriginal, 'options'> & {
    options?: any;
    tree?: boolean;
};

const Select: React.FC<SelectProps> = ({
    allowClear = false,
    onChange,
    options,
    placeholder,
    showSearch = true,
    tree,
    value,
    ...props
}) => (
    <SelectOriginal
        allowClear={allowClear}
        getPopupContainer={(node) => node}
        onChange={onChange as any}
        options={options as any}
        placeholder={placeholder || 'SELECIONE'}
        showSearch={showSearch ? { filterOption } : false}
        value={value}
        {...props}
    />
);

export default Select;

export type { SelectProps };
