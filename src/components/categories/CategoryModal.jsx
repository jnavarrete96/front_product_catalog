import { Modal, Form, Input, Switch, message } from 'antd';
import { useEffect } from 'react';
import { createCategory, updateCategory } from '../../api/categories.api';

const CategoryModal = ({ open, onClose, onSuccess, editingCategory }) => {
  const [form] = Form.useForm();
  const isEditing = !!editingCategory;

  // Cargar datos al editar
  useEffect(() => {
    if (editingCategory) {
      form.setFieldsValue({
        Name: editingCategory.Name,
        Description: editingCategory.Description,
        IsActive: editingCategory.IsActive
      });
    } else {
      form.resetFields();
    }
  }, [editingCategory, form]);

  // Manejar envío del formulario
  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await updateCategory(editingCategory.CategoryId, values);
        message.success('Categoría actualizada exitosamente');
      } else {
        await createCategory(values);
        message.success('Categoría creada exitosamente');
      }
      
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error.message || 'Error al guardar la categoría');
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={isEditing ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ IsActive: true }}
      >
        <Form.Item
          label="Nombre"
          name="Name"
          rules={[
            { required: true, message: 'El nombre es obligatorio' },
            { max: 100, message: 'Máximo 100 caracteres' }
          ]}
        >
          <Input placeholder="Ej: Electrónica" />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="Description"
          rules={[
            { max: 255, message: 'Máximo 255 caracteres' }
          ]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Descripción de la categoría (opcional)"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;