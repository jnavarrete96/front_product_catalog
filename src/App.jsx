import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { AppstoreOutlined, TagsOutlined, ShoppingOutlined } from '@ant-design/icons';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';

const { Header, Content } = Layout;

const App = () => (
  <BrowserRouter>
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header con Menú de navegación */}
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginRight: '50px' }}>
          <AppstoreOutlined /> Catálogo
        </div>
        
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['categories']}
          items={[
            {
              key: 'categories',
              icon: <TagsOutlined />,
              label: <Link to="/categorias">Categorías</Link>
            },
            {
              key: 'products',
              icon: <ShoppingOutlined />,
              label: <Link to="/productos">Productos</Link>
            }
          ]}
        />
      </Header>

      {/* Contenido principal */}
      <Content style={{ padding: '0 50px', marginTop: '24px' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/categorias" replace />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/productos" element={<ProductsPage />} />
        </Routes>
      </Content>
    </Layout>
  </BrowserRouter>
);

export default App;