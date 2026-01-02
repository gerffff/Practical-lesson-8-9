import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../lib/axios';
import { Crop } from './types';

const getCrops = async (withRelations?: boolean): Promise<Crop[]> => {
  const res = await apiClient.get('/crops', {
    params: withRelations ? { withRelations: true } : undefined,
  });
  // Если API возвращает объект с полем data, извлекаем массив оттуда
  const data = res.data;
  return Array.isArray(data) ? data : (data?.data || []);
};

const getCropById = async (
  id: number,
  withRelations?: boolean
): Promise<Crop> => {
  const res = await apiClient.get(`/crops/${id}`, {
    params: withRelations ? { withRelations: true } : undefined,
  });
  // Если API возвращает объект с полем data, извлекаем данные оттуда
  const data = res.data;
  return data?.data || data;
};

const createCrop = async (data: Omit<Crop, 'crop_id'>): Promise<Crop> => {
  const res = await apiClient.post('/crops', data);
  return res.data;
};

const updateCrop = async ({
  id,
  data,
}: {
  id: number;
  data: Partial<Omit<Crop, 'crop_id'>>;
}): Promise<Crop> => {
  const res = await apiClient.put(`/crops/${id}`, data);
  return res.data;
};

const deleteCrop = async (id: number): Promise<void> => {
  await apiClient.delete(`/crops/${id}`);
};

export const useCrops = (withRelations?: boolean) =>
  useQuery({
    queryKey: ['crops', withRelations],
    queryFn: () => getCrops(withRelations),
  });

export const useCrop = (id: number, withRelations?: boolean) =>
  useQuery({
    queryKey: ['crops', id, withRelations],
    queryFn: () => getCropById(id, withRelations),
    enabled: !!id,
  });

export const useCreateCrop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCrop,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crops'] }),
  });
};

export const useUpdateCrop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateCrop,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crops'] }),
  });
};

export const useDeleteCrop = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCrop,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['crops'] }),
  });
};
