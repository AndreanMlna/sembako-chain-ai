import { defineConfig } from '@prisma/config';
import { config } from 'dotenv';

// PERBAIKAN: Memaksa file config untuk membaca isi file .env terlebih dahulu
config();

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL as string, // Sekarang nilai ini tidak akan kosong
    },
});