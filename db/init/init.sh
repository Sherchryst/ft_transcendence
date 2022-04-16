#!/bin/sh

psql -U admin ft_transcendence < /docker-entrypoint-initdb.d/sql/dump.sql
rm -rf sql
