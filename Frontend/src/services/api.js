import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

export const fetchArticles = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.author) params.append('author', filters.author);
  if (filters.language) params.append('language', filters.language);
  if (filters.country) params.append('country', filters.country);
  if (filters.category?.length) params.append('category', filters.category.join(','));
  if (filters.content_type) params.append('content_type', filters.content_type);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const response = await axios.get(`${API_BASE}/news?${params.toString()}`);
  return response.data.articles || response.data;
};

export const fetchArticleById = async (id) => {
  const response = await axios.get(`${API_BASE}/news/${id}`);
  return response.data;
};

export const fetchFilterOptions = async () => {
  const response = await axios.get(`${API_BASE}/news/filters`);
  return response.data;
};

export const triggerNewsFetch = async () => {
  const response = await axios.post(`${API_BASE}/news/fetch-from-file`);
  return response.data;
};

export const refreshNewsFetch = async () => {
  const response = await axios.post(`${API_BASE}/news/fetch`);
  return response.data;
};
