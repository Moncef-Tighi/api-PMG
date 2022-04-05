SELECT
    OBJECT_NAME(i.OBJECT_ID) AS TableName,
    i.name AS IndexName,
    i.index_id AS IndexID,
    CAST(ROUND(8 * SUM(a.used_pages)/ 1024.00, 2) AS NUMERIC(36, 2)) AS 'Indexsize(MB)'
FROM
    sys.indexes AS i
    JOIN sys.partitions AS p ON p.OBJECT_ID = i.OBJECT_ID AND p.index_id = i.index_id
    JOIN sys.allocation_units AS a ON a.container_id = p.partition_id
WHERE
    i.is_primary_key = 0
GROUP BY
    i.OBJECT_ID,
    i.index_id,
    i.name
ORDER BY 'Indexsize(MB)' DESC