import 'dotenv/config';
import pg from 'pg';

// Importa a classe Pool do módulo 'pg' (PostgreSQL) para gerenciar conexões com o banco de dados.
const { Pool } = pg;

// Cria uma instância de Pool, que gerencia múltiplas conexões com o banco de dados de forma eficiente.
// O Pool reutiliza conexões existentes sempre que possível, reduzindo o overhead de criar/destruir conexões.
const db = new Pool({
  // Define a string de conexão com o banco de dados, obtida da variável de ambiente DATABASE_URL.
  // Essa variável deve conter informações como host, porta, usuário, senha e nome do banco.
  connectionString: process.env.DATABASE_URL,
});

// Exporta a instância do Pool para que possa ser usada em outras partes da aplicação.
// Isso permite que diferentes módulos compartilhem a mesma configuração de conexão.
export default db;