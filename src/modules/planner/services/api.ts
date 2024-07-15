import axios from 'axios';

import { Env } from '@/config/env';

export const api = axios.create({
  baseURL: Env.SERVER_BASE_URL,
});
