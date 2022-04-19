---
layout: post
title: SQL - Basic Query, Union and Inner Join
tags: [Notes]
category: ["Notes"]
banner: "/assets/images/banners/SQLBackground.jpg"
---

SQL = Structured Query Language

We use `query` to poll data from `database`

## Query and Select with SQL

SQL - just write the query

in SQL, we usually use CAPITAL to distinct SQL keyword out.

> Generally, we put a newline before each KEYWORD to make query easier to read

### `SELECT` Query

```sql
SELECT [data] FROM [tableName];
```

#### Select all columns 

```sql
SELECT *
FROM cs_data;
```

This will return the whole table (all columns)

#### Select Multiple Columns

```sql
SELECT Col1, Col2 
FROM table_name;
```

### Use `ORDER` to Sort the Data

```sql
SELECT [colName]
FROM [DataTableName]
ORDER BY [colName2] {ASC, DESC};
```

database will return the columns given by `[colName]` from `[DataTableName]`. Then, sort all rows by the value on `[colName2]` in 

* Ascending Rank if `ASC`
* Descending Rank if `DESC`

> Example
>
> ```sql
> SELECT *
> FROM cs_data
> ORDER BY Language ASC;
> ```

We can sort the data and introduce "tie breaker" by appending several sorting conditions

```sql
SELECT [colName]
FROM [DataTableName]
ORDER BY [colName2] ASC, [colName3] DESC;
```

Get `colName` from `DataTableName`, then sort with `colName2` in ascending order. If there are rows with same rank, sort them with value of `colName3` in descending order.

### Limit the Rows returned with `LIMIT` keyword

```sqlite
SELECT *
FROM cs_data
ORDER BY Rating DESC
LIMIT 3;
```

The above code will get the top 3 CS courses 

![image-20210924203522620](https://markdown-img-1304853431.file.myqcloud.com/20210924203529.png)

### Get all Distinct values in database with `DISTINCT` keyword

```sql
SELECT DISTINCT Language
FROM cs_data;
```

<img src="https://markdown-img-1304853431.file.myqcloud.com/20210924203551.png" alt="image-20210924203551834" style="zoom:50%;" />

```sql
SELECT DISTINCT [col1], [col2]
FROM [table_name];
```

<img src="https://markdown-img-1304853431.file.myqcloud.com/20210924203740.png" alt="image-20210924203740595" style="zoom:50%;" />

```sql
SELECT DISTINCT Type, Color
FROM food_data
ORDER BY Type ASC;
```

Get all the possible values of `Type` and `Color` and arrange them in Ascending order with respect of value of `Type`.

### Filter rows using `WHERE` Keyword

```sql
SELECT *
FROM [table_name]
WHERE [col_name]=[value];
```

Besides `WHERE`, there are also boolean operations between conditions - for instance `AND`, `OR` and `NOT`.

Example

> ```sql
> SELECT *
> FROM cs_data
> WHERE Language="C" AND Rating >= 4;
> ```

### Conditioning with `LIKE` Keyword

#### `%` Pattern Matching ("Star")

`%STR` Represents the condition that

> String that end with "STR"

`123%` Represent the condition that

> String that start with "123"

`%ABC%` Represent the condition that

> String contain "ABC" inside it

#### `_` Pattern Matching ("Wildcard")

`a_c` represent a pattern that some string that start with `a` and ends with `c` with a single char between them

`a_c` -> `abc`, `a+c`, ...

Get all the vegetables that name doesn't start with `c`:

```sql
SELECT *
FROM food_data
WHERE Type="vegetables" AND NOT Name LIKE "c%";
```

## Operations with SQL

### Algorithmic Operations

```sql
SELECT Number % 1000, ROUND(Hours) FROM cs_data;
```

Return the rows where `Number` property is mod 1000 and `Hours` property is rounded

<img src="https://markdown-img-1304853431.file.myqcloud.com/20210924210803.png" alt="image-20210924210803229" style="zoom:50%;" />

### Alias in SQL using `AS` keyword

Using `AS`, we can give column a 'nickname'

```sql
SELECT Number % 1000 AS ShortNumber
FROM cs_data;
```

### Getting Sum and Avg with `SUM`, `AVG` and `COUNT` Keyword

<img src="https://markdown-img-1304853431.file.myqcloud.com/20210924211130.png" alt="image-20210924211130609" style="zoom:50%;" />

```sql
SELECT COUNT(*), SUM(Hours), AVG(Rating)
FROM cs_data
WHERE language = "Python";
```

<img src="https://markdown-img-1304853431.file.myqcloud.com/20210924211123.png" alt="image-20210924211123382" style="zoom:50%;" />

`COUNT(*)` - counting rows

### Grouping Rows with `GROUP` Keyword

```sql
SELECT Language, Count(*), SUM(Hours), AVG(Rating)
FROM cs_data
GROUP BY Language;
```

![image-20210924211249664](https://markdown-img-1304853431.file.myqcloud.com/20210924211249.png)

## Use `JOIN` and `UNION`

### Combine `SELECT` Results with `UNION`

```sql
SELECT a FROM cs_table
UNION
SELECT b FROM cs_table
```

If using `UNION`, the repeated result will be removed

If using `UNION ALL`, the repeated result will be reserved

### Combine Data from Different Table with `JOIN`

`INNER JOIN ... ON...` will combine the rows in condition

<img src="https://markdown-img-1304853431.file.myqcloud.com/20210924212111.png" alt="image-20210924212111512" style="zoom:50%;" />

```sql
SELECT NAME, SUM(CostPerPound * Pounds) AS TotalCost
FROM order_data
INNER JOIN price_data
ON order_data.OrderID = price_data.FoodID
GROUP BY Name;
```

## Creating variables using `CREATE VIEW`

You can create a variable as a specific view of table using `CREATE VIEW` command.
