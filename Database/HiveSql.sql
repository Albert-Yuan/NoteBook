describe xx.xxx;

select * from xx.xxxx
where update_time > '2017-02-22';

select length('12345') ;

select * from xx.xxx;

use xx
CREATE TABLE xx.mobile5 (mobile VARCHAR(15))

ALTER TABLE table_name RENAME TO new_table_name;

select * from mobile1;
use xx;

INSERT overwrite  table xx.mobile1
select  distinct mobile from xx.xxx
where mobile  like '1%'
and length(TRIM(mobile)) = 11;

load data local inpath 'D:\aa.txt' overwrite  into table xx.mobile1

SELECT * FROM xx.mobile1;

select * from
(select 1 a,2 b union all select 2 a,22 b) a
       left join (select 1 a,3 b union all select 3 a,33 b) b
       on a.a=b.a
       where b.a is null;

select t.mobile,t2.mobile from
xx.xx t
       left join  xx.xx_common_h5_user t2
       on TRIM(t.mobile) = TRIM(t2.mobile)
       where t2.mobile is null;

INSERT overwrite  table xx.mobile3
select distinct trim(mobile) from xx.xxx
where create_time > '2017-02-01' and create_time < '2017-02-24'
and mobile  like '1%'
and length(TRIM(mobile)) = 11;


INSERT overwrite  table xx.mobile5
select t.mobile from mobile3 t
       left join  mobile4 t2
       on TRIM(t.mobile) = TRIM(t2.mobile)
       where t2.mobile is null;

