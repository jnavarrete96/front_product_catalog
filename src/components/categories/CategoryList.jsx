import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCategories, deleteCategory } from '../../api/categories.api';
import CategoryModal from './CategoryModal';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  // Obtener categorías del backend
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      message.error(error.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success('Categoría eliminada exitosamente');
      fetchCategories();
    } catch (error) {
      message.error(error.message || 'Error al eliminar la categoría');
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'ID',
      dataIndex: 'CategoryId',
      key: 'CategoryId',
      width: 80
    },
    {
      title: 'Nombre',
      dataIndex: 'Name',
      key: 'Name'
    },
    {
      title: 'Descripción',
      dataIndex: 'Description',
      key: 'Description',
      render: (text) => text || '-'
    },
    {
      title: 'Estado',
      dataIndex: 'IsActive',
      key: 'IsActive',
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Tag>
      )
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar categoría?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record.CategoryId)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card
      title="📦 Gestión de Categorías"
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nueva Categoría
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={categories}
        rowKey="CategoryId"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showTotal: (total) => `Total: ${total} categorías`
        }}
      />

      <CategoryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCategories}
        editingCategory={editingCategory}
      />
    </Card>
  );
}

export default CategoryList;