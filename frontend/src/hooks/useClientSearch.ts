import { useState, useEffect, useMemo } from 'react';
import { Client } from '../types';
import { apiService } from '../services/api.ts';

export const useClientSearch = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getClients();
        setClients(data);
      } catch (err) {
        setError('Failed to load clients');
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    
    const term = searchTerm.toLowerCase();
    return clients.filter(
      client =>
        client.name.toLowerCase().includes(term) ||
        client.phone.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  return {
    clients: filteredClients,
    searchTerm,
    setSearchTerm,
    loading,
    error,
  };
};
