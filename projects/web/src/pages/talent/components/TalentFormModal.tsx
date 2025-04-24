import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, message, Row, Col } from 'antd';
import { TalentStatus, TalentInfo } from '../../../types/talent';
import { createTalent, updateTalent } from '../../../api/talent';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';

const { Option } = Select;

interface TalentFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingTalent?: TalentInfo | null; // 如果为null则是新增，否则是编辑
}

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

const operators = [
  '小明',
  '小红',
  '小李',
  '小张',
  '小王'
];

const formItemLayout = {
  labelCol: {
    span: 24,
  },
  wrapperCol: {
    span: 24,
  },
};

const TalentFormModal: React.FC<TalentFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingTalent
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const isEditing = !!editingTalent;

  useEffect(() => {
    if (visible) {
      form.resetFields();
      
      if (editingTalent) {
        // 如果是编辑模式，填充表单数据
        const formData = {
          ...editingTalent,
          // 将日期字符串转换为dayjs对象
          entryTime: editingTalent.entryTime ? dayjs(editingTalent.entryTime) : undefined
        };
        
        form.setFieldsValue(formData);
      }
    }
  }, [visible, editingTalent, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      
      // 处理日期对象
      if (values.entryTime) {
        values.entryTime = values.entryTime.format('YYYY-MM-DD');
      }
      
      if (isEditing) {
        // 编辑现有人才
        await updateTalent({
          ...values,
          id: editingTalent!.id
        });
        message.success(intl.formatMessage({ id: 'talent.message.updateSuccess' }));
      } else {
        // 创建新人才
        await createTalent(values);
        message.success(intl.formatMessage({ id: 'talent.message.createSuccess' }));
      }
      
      onSuccess();
      handleCancel();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('表单验证或提交失败:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const validatePhone = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'talent.form.phone.required' })));
    }
    
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error(intl.formatMessage({ id: 'talent.form.phone.invalid' })));
    }
    
    return Promise.resolve();
  };

  return (
    <Modal
      title={isEditing 
        ? intl.formatMessage({ id: 'talent.modal.edit.title' })
        : intl.formatMessage({ id: 'talent.modal.add.title' })
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={intl.formatMessage({ id: 'talent.modal.form.submit' })}
      cancelText={intl.formatMessage({ id: 'talent.modal.form.cancel' })}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        {...formItemLayout}
        initialValues={{
          gender: '男',
          status: '新候选人',
          operator: operators[0]
        }}
      >
        <Row gutter={16}>
          {/* 左列 */}
          <Col span={12}>
            <Form.Item
              name="name"
              label={intl.formatMessage({ id: 'talent.form.name' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.name.required' }) }]}
            >
              <Input placeholder={intl.formatMessage({ id: 'talent.form.name.placeholder' })} />
            </Form.Item>
            
            <Form.Item
              name="gender"
              label={intl.formatMessage({ id: 'talent.form.gender' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.gender.required' }) }]}
            >
              <Radio.Group style={{ display: 'flex', gap: '16px' }}>
                <Radio value="男">{intl.formatMessage({ id: 'talent.form.gender.male' })}</Radio>
                <Radio value="女">{intl.formatMessage({ id: 'talent.form.gender.female' })}</Radio>
                <Radio value="保密">{intl.formatMessage({ id: 'talent.form.gender.confidential' })}</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item
              name="recruitmentChannel"
              label={intl.formatMessage({ id: 'talent.form.recruitmentChannel' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.recruitmentChannel.required' }) }]}
            >
              <Select placeholder={intl.formatMessage({ id: 'talent.form.recruitmentChannel.placeholder' })}>
                {recruitmentChannels.map(channel => (
                  <Option key={channel} value={channel}>{channel}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          {/* 右列 */}
          <Col span={12}>
            <Form.Item
              name="phone"
              label={intl.formatMessage({ id: 'talent.form.phone' })}
              required
              rules={[{ validator: validatePhone }]}
            >
              <Input placeholder={intl.formatMessage({ id: 'talent.form.phone.placeholder' })} />
            </Form.Item>
            
            <Form.Item
              name="position"
              label={intl.formatMessage({ id: 'talent.form.position' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.position.required' }) }]}
            >
              <Input placeholder={intl.formatMessage({ id: 'talent.form.position.placeholder' })} />
            </Form.Item>
            
            <Form.Item
              name="status"
              label={intl.formatMessage({ id: 'talent.form.status' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.status.required' }) }]}
            >
              <Select placeholder={intl.formatMessage({ id: 'talent.form.status.placeholder' })}>
                {statusOptions.map(status => (
                  <Option key={status} value={status}>{status}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        {/* 底部额外字段（隐藏但保留其功能） */}
        <div style={{ display: 'none' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="entryTime"
                label={intl.formatMessage({ id: 'talent.form.entryTime' })}
                dependencies={['status']}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (getFieldValue('status') === '待入职' && !value) {
                        return Promise.reject(new Error(intl.formatMessage({ id: 'talent.form.entryTime.required' })));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item
                name="operator"
                label={intl.formatMessage({ id: 'talent.form.operator' })}
                rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.operator.required' }) }]}
              >
                <Select placeholder={intl.formatMessage({ id: 'talent.form.operator.placeholder' })}>
                  {operators.map(operator => (
                    <Option key={operator} value={operator}>{operator}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
};

export default TalentFormModal; 