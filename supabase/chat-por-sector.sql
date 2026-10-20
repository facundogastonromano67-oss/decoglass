-- Divide el chat del equipo por sector.
-- Ejecutar en Supabase: panel del proyecto -> SQL Editor -> New query ->
-- pegar y "Run". Es una sola línea y no toca ningún mensaje existente.
--
-- Los mensajes que ya estaban quedan con sector NULL, que es el canal
-- "General": no se pierde ninguno ni cambian de lugar.
--
-- Hasta que esto no se corra, la app NO se rompe: si la columna no existe,
-- el mensaje se manda igual y cae en el general (ver internoEnviar en
-- src/lib/storage.js). Pero los canales por sector no van a separar nada.

alter table chat_interno add column if not exists sector text;

-- Para que listar un canal no tenga que recorrer todos los mensajes.
create index if not exists chat_interno_sector_idx on chat_interno (sector);

-- Comprobación: tiene que devolver una fila con column_name = 'sector'.
-- select column_name, data_type
--   from information_schema.columns
--  where table_name = 'chat_interno' and column_name = 'sector';
