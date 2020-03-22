package database

import (
	"database/sql"

	_ "github.com/lib/pq"

	"go.uber.org/zap"
)

type DB struct {
	*sql.DB

	log *zap.SugaredLogger
}

func NewDB(log *zap.SugaredLogger) *DB {
	db, err := sql.Open("postgres", "dbname=stellarbounty sslmode=verify-full")
	if err != nil {
		log.Fatal(err)
	}
	return &DB{
		DB:  db,
		log: log,
	}
}

func (d *DB) runTxn(fn func(tx *sql.Tx) error) error {
	tx, err := d.Begin()
	if err != nil {
		return err
	}
	if err := fn(tx); err != nil {
		if rollbackErr := tx.Rollback(); rollbackErr != nil {
			d.log.Errorf("unable to rollback: %s", rollbackErr)
		}
		return err
	}
	return tx.Commit()
}
