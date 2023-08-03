-- create the databases
Use nodedb;

Create table if not exists people(id int not null auto_increment, name varchar(255), primary key(id));

Insert into people(name) values ('Jose')

