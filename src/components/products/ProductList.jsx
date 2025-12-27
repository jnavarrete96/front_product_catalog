import { useState, useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message, Tag, Card, Input, Select, InputNumber, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { getProducts, deleteProduct } from '../../api/products.api';
import { getCategories } from '../../api/categories.api';
import ProductModal from './ProductModal';
import BulkUploadModal from './BulkUploadModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Paginación
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // Filtros
  const [filters, setFilters] = useState({
    search: '',
    idCategoria: undefined,
    precioMin: undefined,
    precioMax: undefined,
    activo: undefined
  });

  // Ordenamiento
  const [sorter, setSorter] = useState({
    sortBy: undefined,
    sortDir: undefined
  });

  // Cargar categorías al montar
  useEffect(() => {
    fetchCategories();
  }, []);

  // Cargar productos cuando cambian filtros, paginación o orden
  useEffect(() => {
    fetchProducts();
  }, [pagination.current, pagination.pageSize, filters, sorter]);

  // Obtener categorías
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.filter(c => c.IsActive));
    } catch (error) {
      message.error('Error al cargar las categorías');
    }
  };

  // Obtener productos con filtros y paginación
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        ...sorter
      };

      const data = await getProducts(params);
      
      setProducts(data.items);
      setPagination(prev => ({
        ...prev,
        total: data.total
      }));
    } catch (error) {
      message.error(error.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambio de paginación y ordenamiento
  const handleTableChange = (newPagination, _filters, newSorter) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize
    });

    if (newSorter.field) {
      setSorter({
        sortBy: newSorter.field,
        sortDir: newSorter.order === 'ascend' ? 'asc' : 'desc'
      });
    } else {
      setSorter({
        sortBy: undefined,
        sortDir: undefined
      });
    }
  };

  // Aplicar filtros
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchProducts();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    setFilters({
      search: '',
      idCategoria: undefined,
      precioMin: undefined,
      precioMax: undefined,
      activo: undefined
    });
    setPagination({ ...pagination, current: 1 });
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  // Abrir modal para editar
  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      message.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      message.error(error.message || 'Error al eliminar el producto');
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'Name',
      key: 'Name',
      sorter: true,
      width: 200
    },
    {
      title: 'Categoría',
      dataIndex: ['Category', 'Name'],
      key: 'Category',
      render: (_, record) => record.Category?.Name || '-',
      width: 150
    },
    {
      title: 'SKU',
      dataIndex: 'Sku',
      key: 'Sku',
      render: (text) => text || '-',
      width: 120
    },
    {
      title: 'Precio',
      dataIndex: 'Price',
      key: 'Price',
      sorter: true,
      render: (price) => `$${parseFloat(price).toFixed(2)}`,
      width: 100
    },
    {
      title: 'Stock',
      dataIndex: 'Stock',
      key: 'Stock',
      width: 80
    },
    {
      title: 'Estado',
      dataIndex: 'IsActive',
      key: 'IsActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Tag>
      ),
      width: 100
    },
    {
      title: 'Acciones',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar producto?"
            description="Esta acción no se puede deshacer"
            onConfirm={() => handleDelete(record.ProductId)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card
      title="🛍️ Gestión de Productos"
      extra={
        <Space>
          <Button 
            icon={<UploadOutlined />}
            onClick={() => setBulkModalOpen(true)}
          >
            Carga Masiva
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            Nuevo Producto
          </Button>
        </Space>
      }
    >
      {/* Filtros */}
      <Card size="small" style={{ marginBottom: 16 }} title="Filtros">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Buscar por nombre"
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onPressEnter={handleSearch}
            />
          </Col>
          
          <Col xs={24} sm={12} md={5}>
            <Select
              placeholder="Categoría"
              style={{ width: '100%' }}
              allowClear
              value={filters.idCategoria}
              onChange={(value) => setFilters({ ...filters, idCategoria: value })}
            >
              {categories.map(cat => (
                <Select.Option key={cat.CategoryId} value={cat.CategoryId}>
                  {cat.Name}
                </Select.Option>
              ))}
            </Select>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <InputNumber
              placeholder="Precio mín"
              style={{ width: '100%' }}
              min={0}
              prefix="$"
              value={filters.precioMin}
              onChange={(value) => setFilters({ ...filters, precioMin: value })}
            />
          </Col>

          <Col xs={12} sm={6} md={3}>
            <InputNumber
              placeholder="Precio máx"
              style={{ width: '100%' }}
              min={0}
              prefix="$"
              value={filters.precioMax}
              onChange={(value) => setFilters({ ...filters, precioMax: value })}
            />
          </Col>

          <Col xs={24} sm={12} md={3}>
            <Select
              placeholder="Estado"
              style={{ width: '100%' }}
              allowClear
              value={filters.activo}
              onChange={(value) => setFilters({ ...filters, activo: value })}
            >
              <Select.Option value={true}>Activos</Select.Option>
              <Select.Option value={false}>Inactivos</Select.Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={4}>
            <Space>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Buscar
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleClearFilters}>
                Limpiar
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Tabla */}
      <Table
        columns={columns}
        dataSource={products}
        rowKey="ProductId"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} productos`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
      />

      {/* Modales */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchProducts}
        editingProduct={editingProduct}
      />

      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSuccess={fetchProducts}
      />
    </Card>
  );
}

export default ProductList;