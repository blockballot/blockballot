/* for reference */

CREATE DATABASE blockballot;

USE blockballot;

CREATE TABLE  organization (
  org_id int NOT NULL AUTO_INCREMENT,
  org_name varchar(50)  NOT NULL,
  org_password varchar(200) NOT NULL,
  org_email varchar(50) NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE poll (
  poll_id int NOT NULL AUTO_INCREMENT,
  poll_name varchar(200)  NOT NULL,
  poll_time_start varchar(200) NOT NULL,
  poll_time_end varchar(200) NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE opt (
  opt_id int NOT NULL AUTO_INCREMENT,
  opt_name varchar(50)  NOT NULL,
  PRIMARY KEY (ID)
);

CREATE TABLE voter (
  voter_id int NOT NULL AUTO_INCREMENT,
  voter_uniqueId varchar(200)  NOT NULL,
  PRIMARY KEY (ID)
);

/*  Execute this file from the command line by typing:
 *    mysql -u root < database/schema.sql
 *  to create the database and the tables.*/