import sqlite3
from flask import g

def get_db():
    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect("equipment.db")

    return db

def close_db():
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()
