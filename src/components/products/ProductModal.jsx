import { Modal, Form, Input, InputNumber, Select, Switch, message } from 'antd';
import { useEffect, useState } from 'react';
import { createProduct, updateProduct } from '../../api/products.api';
import { getCategories } from '../../api/categories.api';

const ProductModal = ({ open, onClose, onSuccess, editingProduct }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEditing = !!editingProduct;

  // Cargar categorías al montar
  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Cargar datos al editar
  useEffect(() => {
    if (editingProduct) {
      form.setFieldsValue({
        Name: editingProduct.Name,
        Description: editingProduct.Description,
        Sku: editingProduct.Sku,
        Price: editingProduct.Price,
        Stock: editingProduct.Stock,
        CategoryId: editingProduct.CategoryId,
        IsActive: editingProduct.IsActive
      });
    } else {
      form.resetFields();
    }
  }, [editingProduct, form]);

  // Obtener categorías activas
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.filter(c => c.IsActive));
    } catch (error) {
      message.error('Error al cargar las categorías');
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (isEditing) {
        await updateProduct(editingProduct.ProductId, values);
        message.success('Producto actualizado exitosamente');
      } else {
        await createProduct(values);
        message.success('Producto creado exitosamente');
      }
      
      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cancelación
  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      open={open}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText={isEditing ? 'Actualizar' : 'Crear'}
      cancelText="Cancelar"
      confirmLoading={loading}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ Stock: 0, IsActive: true }}
      >
        <Form.Item
          label="Nombre"
          name="Name"
          rules={[
            { required: true, message: 'El nombre es obligatorio' },
            { max: 150, message: 'Máximo 150 caracteres' }
          ]}
        >
          <Input placeholder="Ej: Teclado mecánico" />
        </Form.Item>

        <Form.Item
          label="Categoría"
          name="CategoryId"
          rules={[
            { required: true, message: 'La categoría es obligatoria' }
          ]}
        >
          <Select placeholder="Seleccione una categoría">
            {categories.map(cat => (
              <Select.Option key={cat.CategoryId} value={cat.CategoryId}>
                {cat.Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="SKU"
          name="Sku"
          rules={[
            { max: 50, message: 'Máximo 50 caracteres' }
          ]}
        >
          <Input placeholder="Ej: TECH-001 (opcional)" />
        </Form.Item>

        <Form.Item
          label="Precio"
          name="Price"
          rules={[
            { required: true, message: 'El precio es obligatorio' },
            { type: 'number', min: 0.01, message: 'El precio debe ser mayor a 0' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            prefix="$"
            min={0.01}
            step={0.01}
            precision={2}
            placeholder="0.00"
          />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="Stock"
          rules={[
            { type: 'number', min: 0, message: 'El stock no puede ser negativo' }
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            min={0}
            placeholder="0"
          />
        </Form.Item>

        <Form.Item
          label="Descripción"
          name="Description"
          rules={[
            { max: 500, message: 'Máximo 500 caracteres' }
          ]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Descripción del producto (opcional)"
          />
        </Form.Item>

        {isEditing && (
          <Form.Item
            label="Estado"
            name="IsActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default ProductModal;