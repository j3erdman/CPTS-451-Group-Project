import sqlite3

def get_db():
    db = sqlite3.connect("equipment.db")

    return db

def close_db(db):
    db.close()
