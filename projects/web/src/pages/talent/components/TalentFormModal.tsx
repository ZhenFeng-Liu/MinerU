import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Radio, message, Row, Col } from 'antd';
import { TalentStatus, TalentInfo } from '../../../types/talent';
import { createTalent, updateTalent, TalentItem } from '../../../api/talentapi';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Option } = Select;

interface TalentFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingTalent?: TalentInfo | null; // 如果为null则是新增，否则是编辑
  initialData?: Partial<TalentInfo & TalentItem> | null; // 从路由传递过来的初始数据
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
  editingTalent,
  initialData
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();
  const isEditing = !!editingTalent;
  const [searchParams] = useSearchParams();
  const inputerFromUrl = searchParams.get('inputer');

  // 从 URL 查询参数中获取 inputer（#前的查询参数）
  const getInputerFromUrl = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return urlSearchParams.get('inputer');
  };
  const inputerFromUrlDirect = getInputerFromUrl();
  
  console.log('inputerFromUrl (useSearchParams):', inputerFromUrl);
  console.log('inputerFromUrlDirect (window.location):', inputerFromUrlDirect);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      console.log('inputerFromUrl',inputerFromUrl);
      if (editingTalent) {
        // 如果是编辑模式，填充表单数据
        const formData = {
          ...editingTalent,
          // 根据新API映射字段
          job: editingTalent.position,
          channel: editingTalent.recruitmentChannel,
          statue: editingTalent.status,
          inputer: editingTalent.operator,
          // 将日期字符串转换为dayjs对象
          create_date: editingTalent.create_date ? dayjs(editingTalent.create_date) : undefined
        };
        
        form.setFieldsValue(formData);
      }else if (initialData) {
        // 如果有初始数据（从路由state传递过来的数据）
        console.log('使用初始数据填充表单:', initialData);
        
        // 根据初始数据结构设置表单字段
        const formData = {
          name: initialData.name || '',
          gender: initialData.gender || '男',
          phone: initialData.phone || '',
          position: initialData.position || initialData.job || '',
          recruitmentChannel: initialData.recruitmentChannel || initialData.channel || '',
          status: initialData.status || initialData.statue || '新候选人',
          operator: inputerFromUrlDirect || inputerFromUrl  || initialData.operator || initialData.inputer || operators[0],
          analysis_task_id: initialData.id || ''
        };
        console.log('formData',formData);
        form.setFieldsValue(formData);
      } else if (inputerFromUrlDirect || inputerFromUrl) {
        // 如果没有初始数据，但URL中有inputer参数
        const operatorValue = inputerFromUrlDirect || inputerFromUrl;
        form.setFieldsValue({ operator: operatorValue });
      }
    }
  }, [visible, editingTalent, form, inputerFromUrl,inputerFromUrlDirect, initialData]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      console.log('values', values); // 调试用，查看values中是否有analysis_task_id
      
      setLoading(true);
      
      // 处理日期对象
      if (values.create_date) {
        values.create_date = values.create_date.format('YYYY-MM-DD');
      }
      
      // 将表单数据转换为API需要的格式
      const talentData: TalentItem = {
        name: values.name,
        gender: values.gender,
        phone: values.phone,
        job: values.position || values.job, // 兼容两种字段名
        channel: values.recruitmentChannel || values.channel, // 兼容两种字段名
        statue: values.status || values.statue, // 兼容两种字段名
        inputer: values.operator || values.inputer, // 兼容两种字段名
        analysis_task_id: values.analysis_task_id ? Number(values.analysis_task_id) : undefined // 转换为数字类型
      };
      
      if (isEditing && editingTalent) {
        // 编辑现有人才
        talentData.id = Number(editingTalent.id); // API需要数字类型的ID
        await updateTalent(talentData);
        message.success(intl.formatMessage({ id: 'talent.message.updateSuccess' }));
      } else {
        // 创建新人才
        await createTalent(talentData);
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
        {/* 隐藏字段用于保存analysis_task_id */}
        <Form.Item name="analysis_task_id" hidden>
          <Input />
        </Form.Item>
        
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
        
        {/* 底部额外字段 */}
        <Row gutter={16} hidden>
          <Col span={12}>
            <Form.Item
              name="operator"
              label={intl.formatMessage({ id: 'talent.form.operator' })}
              required
              rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.operator.required' }) }]}
            >
              <Select placeholder={intl.formatMessage({ id: 'talent.form.operator.placeholder' })}>
                {operators.map(op => (
                  <Option key={op} value={op}>{op}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default TalentFormModal; 