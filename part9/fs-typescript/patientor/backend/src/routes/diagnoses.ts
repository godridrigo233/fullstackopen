import { Router } from 'express';
import diagnoses from '../../data/diagnoses.ts';

const diagnosisRouter = Router();

diagnosisRouter.get('/', (_request, response) => {
  response.json(diagnoses);
});

export default diagnosisRouter;
