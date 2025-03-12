import { supabase } from './supabase';
import { Donation } from '@/types';

export const createDonation = async (donation: Omit<Donation, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('donations')
    .insert([donation])
    .select();
  if (error) throw error;
  return data[0] as Donation;
};