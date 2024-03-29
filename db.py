"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system('dropdb miceTrack2')
os.system('createdb miceTrack2')

model.connect_to_db(server.app)
model.db.create_all()
