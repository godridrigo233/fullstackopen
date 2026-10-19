import axios from "axios";
import type {
  Diagnosis,
  Entry,
  NewEntry,
  NonSensitivePatient,
  Patient,
  PatientFormValues,
} from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<NonSensitivePatient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const getById = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
  return data;
};

const getDiagnoses = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

const createEntry = async (id: string, entry: NewEntry) => {
  const { data } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, entry);
  return data;
};

export default {
  getAll,
  create,
  getById,
  getDiagnoses,
  createEntry,
};
