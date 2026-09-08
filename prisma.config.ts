import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/sembako_chain_ai?schema=public',
    },
});
