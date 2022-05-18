"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system("dropdb miceTrack")
os.system('createdb miceTrack')

model.connect_to_db(server.app)
model.db.create_all()

# with open('data/dummydata.json') as f:
#     movie_data = json.loads(f.read())

# Create female mice and pups and store the in list
# so i can use to populate table
# mice_data = []

# for row in mice_data:
