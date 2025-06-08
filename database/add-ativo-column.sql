-- Adicionar coluna 'ativo' na tabela produtos se ela não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'produtos' 
        AND column_name = 'ativo'
    ) THEN
        ALTER TABLE produtos ADD COLUMN ativo BOOLEAN DEFAULT true;
        
        -- Atualizar produtos existentes para ativo = true por padrão
        UPDATE produtos SET ativo = true WHERE ativo IS NULL;
        
        -- Adicionar comentário na coluna
        COMMENT ON COLUMN produtos.ativo IS 'Status do produto: true = ativo, false = inativo';
        
        RAISE NOTICE 'Coluna ativo adicionada à tabela produtos';
    ELSE
        RAISE NOTICE 'Coluna ativo já existe na tabela produtos';
    END IF;
END $$;

-- Criar índice para melhorar performance das consultas por status
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);

-- Verificar a estrutura atual da tabela
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'produtos'
ORDER BY ordinal_position;
