import api from "@/common/utils/api";

const fetchKpis = async () => {
  const response = await api().get("/kpis");
  return response.data;
};

const fetchKpiById = async (id) => {
  const response = await api().get(`/kpis/${id}`);
  return response.data;
};

const createKpi = async (payload) => {
  const response = await api().post("/kpis", payload);
  return response.data;
};

const updateKpi = async (id, payload) => {
  const response = await api().put(`/kpis/${id}`, payload);
  return response.data;
};

const deleteKpi = async (id) => {
  const response = await api().delete(`/kpis/${id}`);
  return response.data;
};

const kpisService = {
  fetchKpis,
  fetchKpiById,
  createKpi,
  updateKpi,
  deleteKpi,
};

export default kpisService;
