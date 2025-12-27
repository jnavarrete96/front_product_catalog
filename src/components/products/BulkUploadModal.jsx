import { Modal, Upload, Button, message, Alert } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { uploadBulkProducts } from '../../api/products.api';
import * as XLSX from 'xlsx';

const BulkUploadModal = ({ open, onClose, onSuccess }) => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Configuración del Upload
  const uploadProps = {
    accept: '.xlsx,.xls,.csv',
    maxCount: 1,
    beforeUpload: (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                      file.type === 'application/vnd.ms-excel' ||
                      file.type === 'text/csv';
      
      if (!isExcel) {
        message.error('Solo se permiten archivos Excel (.xlsx, .xls) o CSV');
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('El archivo no debe superar los 5MB');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false; // No subir automáticamente
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList
  };

  // Manejar la subida
  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Debe seleccionar un archivo');
      return;
    }

    setLoading(true);
    try {
      const result = await uploadBulkProducts(fileList[0]);
      message.success(`${result.message}. Insertados: ${result.inserted}`);
      setFileList([]);
      onSuccess();
      onClose();
    } catch (error) {
      message.error(error.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  // Descargar plantilla de ejemplo
  const downloadTemplate = () => {
    const template = [
      {
        Name: 'Teclado Mecánico',
        Description: 'Teclado RGB con switches azules',
        Sku: 'TECH-001',
        Price: 89.99,
        Stock: 15,
        CategoryId: 1
      },
      {
        Name: 'Mouse Gamer',
        Description: 'Mouse óptico 16000 DPI',
        Sku: 'TECH-002',
        Price: 45.50,
        Stock: 25,
        CategoryId: 1
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 20 }, // Name
      { wch: 30 }, // Description
      { wch: 12 }, // Sku
      { wch: 10 }, // Price
      { wch: 8 },  // Stock
      { wch: 12 }  // CategoryId
    ];

    XLSX.writeFile(wb, 'plantilla_productos.xlsx');
    message.success('Plantilla descargada');
  };

  // Manejar cancelación
  const handleCancel = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title="📤 Carga Masiva de Productos"
      open={open}
      onOk={handleUpload}
      onCancel={handleCancel}
      okText="Subir"
      cancelText="Cancelar"
      confirmLoading={loading}
      width={600}
    >
      <Alert
        message="Formato del archivo"
        description={
          <div>
            <p>El archivo debe contener las siguientes columnas:</p>
            <ul>
              <li><strong>Name</strong> (obligatorio): Nombre del producto</li>
              <li><strong>CategoryId</strong> (obligatorio): ID de la categoría</li>
              <li><strong>Price</strong> (obligatorio): Precio (mayor a 0)</li>
              <li><strong>Description</strong> (opcional): Descripción</li>
              <li><strong>Sku</strong> (opcional): Código SKU</li>
              <li><strong>Stock</strong> (opcional): Cantidad en stock</li>
            </ul>
          </div>
        }
        type="info"
        style={{ marginBottom: 16 }}
      />

      <Button
        icon={<DownloadOutlined />}
        onClick={downloadTemplate}
        style={{ marginBottom: 16 }}
        block
      >
        Descargar Plantilla de Ejemplo
      </Button>

      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} block>
          Seleccionar Archivo (.xlsx, .csv)
        </Button>
      </Upload>

      {fileList.length > 0 && (
        <Alert
          message="Archivo seleccionado"
          description={`${fileList[0].name} (${(fileList[0].size / 1024).toFixed(2)} KB)`}
          type="success"
          style={{ marginTop: 16 }}
        />
      )}
    </Modal>
  );
}

export default BulkUploadModal;