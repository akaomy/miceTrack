"""Server for miceTrack  app."""

from flask import (Flask, render_template, request, flash, session, redirect)
from model import connect_to_db, db
import crud
import json
# from datetime import datetime 

app = Flask(__name__)
app.secret_key = "dev"

    
@app.route("/")
def homepage():
    """View homepage."""
    
    return render_template("homepage.html")


@app.route('/track-mice')
def display_mice_micetrack_table_rows():
    """Display micetrack table """

    female_mice = crud.get_all_female_mice()

    mouse_data_list = []
    for mouse in female_mice:
        mouse_data = {}
        mouse_data["female_mouse_id"] = mouse.female_mouse_id
        mouse_data["female_mouse_manual_id"] = mouse.female_mouse_manual_id
        mouse_data["mating_date"] = mouse.mating_date
        mouse_data["pregnant"] = mouse.pregnant
        mouse_data["has_pups"] = mouse.has_pups
        mouse_data_list.append(mouse_data)

    return json.dumps(mouse_data_list, default=str)
    

@app.route('/track-mice/create', methods=['POST'])
def create_mice_table_row():
    """Track a mice"""

    female_mouse_manual_id = request.json.get("female_mouse_manual_id")
    mating_date = request.json.get("mating_date")
    check_if_pregnant = request.json.get("check_if_pregnant")
    has_pups = request.json.get("has_pups")

    if (has_pups == 'on'):
        has_pups = True
    else:
        has_pups = False

    crud.create_female_mouse(female_mouse_manual_id, mating_date, check_if_pregnant, has_pups)

    return { "status": "The info has been added to the table" }


@app.route('/track-mice/update',  methods=['POST'])
def update_mouse_table_row():
    """Update mouse table row"""

    female_mouse_id = request.json.get("female_mouse_id")
    female_mouse_manual_id = request.json.get("female_mouse_manual_id")
    mating_date = request.json.get("mating_date")
    check_if_pregnant = request.json.get("check_if_pregnant")
    has_pups = request.json.get("has_pups")

    if (check_if_pregnant == 'on'):
        check_if_pregnant = True
    else:
        check_if_pregnant = False

    crud.update_female_row_data(female_mouse_id, female_mouse_manual_id, mating_date, check_if_pregnant, has_pups)

    return { "status": "The info has been updated" }


@app.route('/track-mice', methods=['DELETE'])
def delete_mouse_table_row():
    """Delete a row in micetrack table """
    
    female_id = request.get_json("mouse_id")

    crud.delete_female_row_data(female_id)
    db.session.commit()

    return { "status": "mice data has been deleted" }


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
