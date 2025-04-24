import React, { useState } from 'react';
import { Modal, Form, Select, message } from 'antd';
import { TalentStatus } from '../../../types/talent';
import { batchUpdateStatus } from '../../../api/talent';
import { useIntl } from 'react-intl';

const { Option } = Select;

interface TalentStatusModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  selectedIds: string[];
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

const TalentStatusModal: React.FC<TalentStatusModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  selectedIds
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const handleOk = async () => {
    try {
      const { status } = await form.validateFields();
      
      if (!status) {
        message.error(intl.formatMessage({ id: 'talent.message.selectStatus' }));
        return;
      }
      
      if (selectedIds.length === 0) {
        message.error(intl.formatMessage({ id: 'talent.message.selectCandidate' }));
        return;
      }
      
      setLoading(true);
      await batchUpdateStatus(selectedIds, status);
      
      message.success(intl.formatMessage({ id: 'talent.message.statusUpdateSuccess' }));
      form.resetFields();
      onSuccess();
      onCancel();
    } catch (error: unknown) {
      console.error('批量更新状态失败:', error);
      message.error(intl.formatMessage({ id: 'talent.message.statusUpdateFailed' }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={intl.formatMessage({ id: 'talent.modal.batchUpdateStatus.title' })}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText={intl.formatMessage({ id: 'talent.modal.form.submit' })}
      cancelText={intl.formatMessage({ id: 'talent.modal.form.cancel' })}
    >
      <p>
        {intl.formatMessage(
          { id: 'talent.modal.batchUpdateStatus.content' },
          { count: selectedIds.length }
        )}
      </p>
      <Form form={form} layout="vertical">
        <Form.Item
          name="status"
          rules={[{ required: true, message: intl.formatMessage({ id: 'talent.form.status.required' }) }]}
        >
          <Select placeholder={intl.formatMessage({ id: 'talent.form.status.placeholder' })}>
            {statusOptions.map(status => (
              <Option key={status} value={status}>
                {intl.formatMessage({ id: `talent.status.${
                  status === '新候选人' ? 'new' :
                  status === '初选通过' ? 'firstPass' :
                  status === '安排面试' ? 'interview' :
                  status === '面试通过' ? 'interviewPass' :
                  status === '已发offer' ? 'offered' :
                  status === '待入职' ? 'pendingEntry' :
                  status === '已发offer未入职' ? 'offeredNotJoined' :
                  'eliminated'
                }` })}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TalentStatusModal; 