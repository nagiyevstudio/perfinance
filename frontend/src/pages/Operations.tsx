import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/common/Layout';
import MonthSelector from '../components/Dashboard/MonthSelector';
import AnalyticsTotals from '../components/Analytics/AnalyticsTotals';
import OperationsPanel from '../components/Operations/OperationsPanel';
import OperationForm from '../components/Dashboard/OperationForm';
import { getCurrentMonth } from '../utils/format';
import {
  categoriesApi,
  analyticsApi,
  operationsApi,
  CreateOperationRequest,
  Operation,
} from '../services/api';


export default function Operations() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [showOperationForm, setShowOperationForm] = useState(false);
  const [editingOperation, setEditingOperation] = useState<Operation | null>(null);

  const queryClient = useQueryClient();

  // Загружаем все операции за месяц сразу (pageSize = 10000 для загрузки всех)
  const { data: operationsData, isLoading: operationsLoading } = useQuery({
    queryKey: ['operations', selectedMonth],
    queryFn: () => operationsApi.list({ month: selectedMonth, page: 1, pageSize: 10000 }),
  });

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics', selectedMonth],
    queryFn: () => analyticsApi.get(selectedMonth),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list(),
  });

  const operationMutation = useMutation({
    mutationFn: (data: CreateOperationRequest) =>
      editingOperation ? operationsApi.update(editingOperation.id, data) : operationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', selectedMonth] });
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['budget', selectedMonth] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      setShowOperationForm(false);
      setEditingOperation(null);
    },
  });

  const deleteOperationMutation = useMutation({
    mutationFn: (id: string) => operationsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operations', selectedMonth] });
      queryClient.invalidateQueries({ queryKey: ['operations'] });
      queryClient.invalidateQueries({ queryKey: ['budget', selectedMonth] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  const handleAddOperation = () => {
    setEditingOperation(null);
    setShowOperationForm(true);
  };

  const handleEditOperation = (operation: Operation) => {
    setEditingOperation(operation);
    setShowOperationForm(true);
  };

  const handleDeleteOperation = async (id: string) => {
    await deleteOperationMutation.mutateAsync(id);
  };

  const handleSaveOperation = async (data: CreateOperationRequest) => {
    await operationMutation.mutateAsync(data);
  };


  const categories = categoriesData?.categories || [];
  const operations = operationsData?.operations || [];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8">
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
        <div className="mb-6">
          <AnalyticsTotals totals={analyticsData?.totals} isLoading={analyticsLoading} />
        </div>
        <OperationsPanel
          operations={operations}
          isLoading={operationsLoading}
          onAdd={handleAddOperation}
          onEdit={handleEditOperation}
          onDelete={handleDeleteOperation}
        />

        {showOperationForm && (
          <OperationForm
            operation={editingOperation}
            categories={categories}
            onSubmit={handleSaveOperation}
            onCancel={() => {
              setShowOperationForm(false);
              setEditingOperation(null);
            }}
            onDelete={editingOperation ? () => handleDeleteOperation(editingOperation.id) : undefined}
          />
        )}
      </div>
    </Layout>
  );
}
