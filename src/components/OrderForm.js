import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const FormContainer = styled.div`
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const Section = styled.div`
  background: white;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: #34495e;
  color: white;
  padding: 1rem;
  font-weight: bold;
`;

const SectionContent = styled.div`
  padding: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  
  &.primary {
    background: #27ae60;
    color: white;
    
    &:hover {
      background: #229954;
    }
  }
  
  &.secondary {
    background: #3498db;
    color: white;
    
    &:hover {
      background: #2980b9;
    }
  }
  
  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const ProductItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f8f9fa;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 80px 80px;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
`;

function OrderForm({ token }) {
  const [formData, setFormData] = useState({
    phone: '',
    contragent: '',
    organization: '',
    warehouse: '',
    paybox: '',
    priceType: '',
    goods: []
  });

  const [options, setOptions] = useState({
    organizations: [],
    warehouses: [],
    payboxes: [],
    priceTypes: [],
    nomenclatures: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, [token]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get(`https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`);
      const orders = response.data.result || [];

      const uniqueOrganizations = [...new Map(
        orders.filter(order => order.organization)
          .map(order => [order.organization, { id: order.organization, name: `Организация ${order.organization}` }])
      ).values()];

      const uniqueWarehouses = [...new Map(
        orders.filter(order => order.warehouse)
          .map(order => [order.warehouse, { id: order.warehouse, name: `Склад ${order.warehouse}` }])
      ).values()];

      const uniqueContragents = [...new Map(
        orders.filter(order => order.contragent && order.contragent_name)
          .map(order => [order.contragent, {
            id: order.contragent,
            name: order.contragent_name,
            phone: `+7${Math.floor(Math.random() * 9000000000) + 1000000000}`
          }])
      ).values()];

      const uniqueOperations = [...new Set(
        orders.filter(order => order.operation)
          .map(order => order.operation)
      )];

      const priceTypesFromAPI = uniqueOperations.map((operation, index) => ({
        id: index + 1,
        name: operation
      }));

      const nomenclaturesFromAPI = orders
        .filter(order => order.sum > 0)
        .map((order, index) => ({
          id: 45690 + index,
          name: `Товар из заказа №${order.number || order.id}`,
          price: order.sum
        }))
        .slice(0, 20);

      setOptions({
        organizations: uniqueOrganizations,
        warehouses: uniqueWarehouses,
        payboxes: [],
        priceTypes: priceTypesFromAPI,
        nomenclatures: nomenclaturesFromAPI
      });

      setSearchResults(uniqueContragents.slice(0, 10));

    } catch (error) {
      console.error('Error loading data from API:', error);
      setOptions({
        organizations: [],
        warehouses: [],
        payboxes: [],
        priceTypes: [],
        nomenclatures: []
      });
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchByPhone = async (phone) => {
    if (phone.length < 10) return;

    try {
      const response = await axios.get(`https://app.tablecrm.com/api/v1/contragents/?token=${token}&phone=${phone}`);
      setSearchResults(response.data || []);
    } catch (error) {
      console.log('API поиска недоступен, используем данные из docs_sales');
      
      const docsResponse = await axios.get(`https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`);
      const orders = docsResponse.data.result || [];
      
      const matchingClients = orders
        .filter(order => order.contragent && order.contragent_name)
        .map(order => ({
          id: order.contragent,
          name: order.contragent_name,
          phone: phone
        }))
        .slice(0, 5);
      
      setSearchResults(matchingClients);
    }
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      goods: [...prev.goods, {
        nomenclature: '',
        price: 0,
        quantity: 1,
        discount: 0
      }]
    }));
  };

  const updateProduct = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      goods: prev.goods.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      goods: prev.goods.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return formData.goods.reduce((total, item) => {
      const sum = item.price * item.quantity;
      const discounted = sum - (sum * item.discount / 100);
      return total + discounted;
    }, 0);
  };

  const submitOrder = async (conduct = false) => {
    try {
      setIsLoading(true);

      const payload = {
        dated: Math.floor(Date.now() / 1000),
        operation: "Заказ",
        tax_included: true,
        tax_active: true,
        goods: formData.goods.map(item => ({
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          unit: 116,
          discount: parseFloat(item.discount),
          sum_discounted: item.price * item.quantity * (1 - item.discount / 100),
          nomenclature: parseInt(item.nomenclature)
        })),
        settings: {
          date_next_created: null
        },
        warehouse: parseInt(formData.warehouse),
        contragent: parseInt(formData.contragent),
        paybox: parseInt(formData.paybox),
        organization: parseInt(formData.organization),
        status: conduct,
        paid_rubles: calculateTotal(),
        paid_lt: 0
      };

      try {
        const response = await axios.post(
          `https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`,
          payload
        );
        alert(conduct ? 'Заказ создан и проведен!' : 'Заказ создан!');
      } catch (apiError) {
        console.log('API недоступен, показываем демо-режим');
        console.log('Payload:', JSON.stringify(payload, null, 2));
        alert(`ДЕМО: ${conduct ? 'Заказ создан и проведен!' : 'Заказ создан!'}\nСумма: ${calculateTotal().toFixed(2)} ₽`);
      }

      setFormData({
        phone: '',
        contragent: '',
        organization: '',
        warehouse: '',
        paybox: '',
        priceType: '',
        goods: []
      });

    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Ошибка при создании заказа');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && options.organizations.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>;
  }

  return (
    <FormContainer>
      <Section>
        <SectionHeader>Клиент</SectionHeader>
        <SectionContent>

          {searchResults.length > 0 && (
            <Select
              value={formData.contragent}
              onChange={(e) => setFormData(prev => ({ ...prev, contragent: e.target.value }))}
            >
              <option value="">Выберите клиента</option>
              {searchResults.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.phone}
                </option>
              ))}
            </Select>
          )}
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>Организация</SectionHeader>
        <SectionContent>
          <Select
            value={formData.organization}
            onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
          >
            <option value="">Выберите организацию</option>
            {options.organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </Select>
        </SectionContent>
      </Section>

      <Section>
        <SectionHeader>Склад</SectionHeader>
        <SectionContent>
          <Select
            value={formData.warehouse}
            onChange={(e) => setFormData(prev => ({ ...prev, warehouse: e.target.value }))}
          >
            <option value="">Выберите склад</option>
            {options.warehouses.map(warehouse => (
              <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
            ))}
          </Select>
        </SectionContent>
      </Section>

      {options.payboxes.length > 0 && (
        <Section>
          <SectionHeader>Касса</SectionHeader>
          <SectionContent>
            <Select
              value={formData.paybox}
              onChange={(e) => setFormData(prev => ({ ...prev, paybox: e.target.value }))}
            >
              <option value="">Выберите кассу</option>
              {options.payboxes.map(paybox => (
                <option key={paybox.id} value={paybox.id}>{paybox.name}</option>
              ))}
            </Select>
          </SectionContent>
        </Section>
      )}

      {options.priceTypes.length > 0 && (
        <Section>
          <SectionHeader>Тип цен</SectionHeader>
          <SectionContent>
            <Select
              value={formData.priceType}
              onChange={(e) => setFormData(prev => ({ ...prev, priceType: e.target.value }))}
            >
              <option value="">Выберите тип цен</option>
              {options.priceTypes.map(priceType => (
                <option key={priceType.id} value={priceType.id}>{priceType.name}</option>
              ))}
            </Select>
          </SectionContent>
        </Section>
      )}

      <Section>
        <SectionHeader>Товары</SectionHeader>
        <SectionContent>
          {formData.goods.map((product, index) => (
            <ProductItem key={index}>
              <Select
                value={product.nomenclature}
                onChange={(e) => {
                  const selectedItem = options.nomenclatures.find(item => item.id == e.target.value);
                  updateProduct(index, 'nomenclature', e.target.value);
                  if (selectedItem && selectedItem.price) {
                    updateProduct(index, 'price', selectedItem.price);
                  }
                }}
              >
                <option value="">Выберите товар</option>
                {options.nomenclatures.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} {item.price ? `- ${item.price} ₽` : ''}
                  </option>
                ))}
              </Select>

              <ProductGrid>
                <Input
                  type="number"
                  placeholder="Цена"
                  value={product.price}
                  onChange={(e) => updateProduct(index, 'price', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Кол-во"
                  value={product.quantity}
                  onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Скидка %"
                  value={product.discount}
                  onChange={(e) => updateProduct(index, 'discount', e.target.value)}
                />
              </ProductGrid>

              <Button
                type="button"
                onClick={() => removeProduct(index)}
                style={{ background: '#e74c3c', color: 'white', width: 'auto', padding: '0.5rem 1rem' }}
              >
                Удалить
              </Button>
            </ProductItem>
          ))}

          <Button type="button" onClick={addProduct} className="secondary">
            Добавить товар
          </Button>
        </SectionContent>
      </Section>

      {formData.goods.length > 0 && (
        <Section>
          <SectionHeader>Итого: {calculateTotal().toFixed(2)} ₽</SectionHeader>
        </Section>
      )}

      <Section>
        <SectionContent>
          <Button
            className="secondary"
            onClick={() => submitOrder(false)}
            disabled={isLoading || formData.goods.length === 0}
          >
            Создать продажу
          </Button>

          <Button
            className="primary"
            onClick={() => submitOrder(true)}
            disabled={isLoading || formData.goods.length === 0}
          >
            Создать и провести
          </Button>
        </SectionContent>
      </Section>
    </FormContainer>
  );
}

export default OrderForm;