import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { FieldWork } from './types';

const getFieldWorks = async (withRelations?: boolean): Promise<FieldWork[]> => {
  const res = await apiClient.get('/field-works', {
    params: withRelations ? { withRelations: true } : undefined,
  });
  // Если API возвращает объект с полем data, извлекаем массив оттуда
  const data = res.data;
  return Array.isArray(data) ? data : (data?.data || []);
};

const getFieldWorkById = async (
  id: number,
  withRelations?: boolean
): Promise<FieldWork> => {
  const res = await apiClient.get(`/field-works/${id}`, {
    params: withRelations ? { withRelations: true } : undefined,
  });
  // Если API возвращает объект с полем data, извлекаем данные оттуда
  const data = res.data;
  return data?.data || data;
};

const createFieldWork = async (
  data: Omit<FieldWork, 'work_id'>
): Promise<FieldWork> => {
  const res = await apiClient.post('/field-works', data);
  return res.data;
};

const updateFieldWork = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Omit<FieldWork, 'work_id'>>;
}): Promise<FieldWork> => {
  const res = await apiClient.put(`/field-works/${id}`, data);
  return res.data;
};

const deleteFieldWork = async (id: number): Promise<void> => {
  await apiClient.delete(`/field-works/${id}`);
};

export const useFieldWorks = (withRelations?: boolean) =>
  useQuery({
    queryKey: ['field-works', withRelations],
    queryFn: () => getFieldWorks(withRelations),
  });

export const useFieldWork = (id: number, withRelations?: boolean) =>
  useQuery({
    queryKey: ['field-works', id, withRelations],
    queryFn: () => getFieldWorkById(id, withRelations),
    enabled: !!id,
  });

export const useCreateFieldWork = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFieldWork,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['field-works'] }),
  });
};

export const useUpdateFieldWork = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateFieldWork,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['field-works'] }),
  });
};

export const useDeleteFieldWork = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFieldWork,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['field-works'] }),
  });
};
