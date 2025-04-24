import React from 'react';
import { Form, Input, Select, DatePicker, Button, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { TalentStatus } from '../../../types/talent';
import { useIntl } from 'react-intl';
import type { RangePickerProps } from 'antd/es/date-picker';
import './buttonStyles.css'; // 导入按钮样式

const { Option } = Select;
const { RangePicker } = DatePicker;

interface TalentSearchProps {
  onSearch: (values: SearchFormValues) => void;
  onReset: () => void;
}

interface SearchFormValues {
  keyword?: string;
  status?: TalentStatus;
  recruitmentChannel?: string;
  timeRange?: RangePickerProps['value'];
}

const recruitmentChannels = [
  '前程无忧',
  'Boss直聘',
  '智联招聘',
  '拉勾网',
  '猎聘网',
  '中国人才热线',
  '58同城',
  '赶集网',
  '大街网',
  '中华英才网',
  '内部推荐',
  '员工推荐',
  '微信招聘',
  '其他'
];

const statusOptions: TalentStatus[] = [
  '新候选人',
  '初选通过',
  '安排面试',
  '面试通过',
  '已发offer',
  '待入职',
  '已发offer未入职',
  '已淘汰'
];

const TalentSearch: React.FC<TalentSearchProps> = ({ onSearch, onReset }) => {
  const [form] = Form.useForm<SearchFormValues>();
  const intl = useIntl();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Card className="mb-4">
      <Form 
        form={form}
        layout="inline"
        onFinish={onSearch}
        className="w-full flex flex-wrap gap-2"
      >
        <Form.Item label={intl.formatMessage({ id: 'talent.search.keyword' })} name="keyword" className="flex-1 min-w-[180px]">
          <Input 
            placeholder={intl.formatMessage({ id: 'talent.search.keyword.placeholder' })}
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        
        <Form.Item label={intl.formatMessage({ id: 'talent.search.status' })} name="status" className="min-w-[120px]">
          <Select 
            placeholder={intl.formatMessage({ id: 'talent.search.status.placeholder' })}
            allowClear
          >
            {statusOptions.map(status => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item label={intl.formatMessage({ id: 'talent.search.recruitmentChannel' })} name="recruitmentChannel" className="min-w-[120px]">
          <Select 
            placeholder={intl.formatMessage({ id: 'talent.search.recruitmentChannel.placeholder' })}
            allowClear
          >
            {recruitmentChannels.map(channel => (
              <Option key={channel} value={channel}>
                {channel}
              </Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item label={intl.formatMessage({ id: 'talent.search.timeRange' })} name="timeRange" className="min-w-[280px]">
          <RangePicker 
            placeholder={[
              intl.formatMessage({ id: 'talent.search.timeRange.startPlaceholder' }),
              intl.formatMessage({ id: 'talent.search.timeRange.endPlaceholder' })
            ]}
          />
        </Form.Item>
        
        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SearchOutlined />}
            className="no-outline-btn"
          >
            {intl.formatMessage({ id: 'talent.search.button.search' })}
          </Button>
        </Form.Item>
        
        <Form.Item className="mb-0">
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
            className="no-outline-btn"
          >
            {intl.formatMessage({ id: 'talent.search.button.reset' })}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TalentSearch; 