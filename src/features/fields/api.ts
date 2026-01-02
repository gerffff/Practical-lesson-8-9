import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { Field } from './types';

const getFields = async (withCrops?: boolean): Promise<Field[]> => {
  const res = await apiClient.get('/fields', {
    params: withCrops ? { withCrops: true } : undefined,
  });

  const data = res.data;
  return Array.isArray(data) ? data : (data?.data || []);
};

const getFieldByName = async (
  fieldName: string,
  params?: { withCrops?: boolean; forUpdate?: boolean }
): Promise<Field> => {
  const res = await apiClient.get(`/fields/${fieldName}`, { params });

  const data = res.data;
  return data?.data || data;
};

const createField = async (data: Field): Promise<Field> => {
  const res = await apiClient.post('/fields', data);
  return res.data;
};

const updateField = async ({
  field_name,
  data,
}: {
  field_name: string;
  data: Partial<Omit<Field, 'field_name'>>;
}): Promise<Field> => {
  const res = await apiClient.put(`/fields/${field_name}`, data);
  return res.data;
};

const deleteField = async (field_name: string): Promise<void> => {
  await apiClient.delete(`/fields/${field_name}`);
};

export const useFields = (withCrops?: boolean) =>
  useQuery({
    queryKey: ['fields', withCrops],
    queryFn: () => getFields(withCrops),
  });

export const useField = (
  field_name: string,
  params?: { withCrops?: boolean; forUpdate?: boolean }
) =>
  useQuery({
    queryKey: ['fields', field_name, params],
    queryFn: () => getFieldByName(field_name, params),
    enabled: !!field_name,
  });

export const useCreateField = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createField,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fields'] }),
  });
};

export const useUpdateField = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateField,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fields'] }),
  });
};

export const useDeleteField = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteField,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['fields'] }),
  });
};
