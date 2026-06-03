import { Skeleton } from 'antd';

const Loading = () => {
    return <Skeleton active paragraph={{ rows: 20, width: '100%' }} title={false} />;
};

export default Loading;
