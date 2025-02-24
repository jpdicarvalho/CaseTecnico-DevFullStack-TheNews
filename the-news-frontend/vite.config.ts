import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/TheNews-FullStack-Project/', // Nome correto do repositório
});