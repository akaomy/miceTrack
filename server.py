"""Server for miceTrack  app."""

from flask import (Flask, render_template, request, flash, session, redirect)
from model import connect_to_db, db
import crud
import json
from jinja2 import StrictUndefined
from datetime import datetime 

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

    
@app.route("/")
def homepage():
    """View homepage."""
    
    return render_template("homepage.html")

@app.route('/track-mice')
def display_mice_micetrack_table_rows():
    """Display micetrack table """

    female_mice = crud.get_all_female_mice()
    # pups = crud.get_all_pup()

    mouse_data_list = []
    for mouse in female_mice:
        mouse_data = {}
        mouse_data["female_mouse_id"] = mouse.female_mouse_id
        mouse_data["mating_date"] = mouse.mating_date
        mouse_data["days_in_breeding"] = mouse.days_in_breeding
        mouse_data["check_pregnancy"] = mouse.check_pregnancy
        mouse_data["pregnant"] = mouse.pregnant
        mouse_data_list.append(mouse_data)

    # for pup in pups:
    #     pup_data = {}
    #     pup_data["litter_id"] = pup.litter_id
    #     pup_data["pup_strain"] = pup.pup_strain
    #     pup_data["date_of_birth"] = pup.date_of_birth
    #     mouse_data_list.append(pup_data)

    #  i wanna return all female mouse with corresponding pups
    #  litter id
        
    return json.dumps(mouse_data_list, default=str)


@app.route('/track-mice/create', methods=['POST'])
def create_mice_table_row():
    """Track a mice"""

    female_mouse_manual_id = request.json.get("female_mouse_manual_id")
    mating_date = request.json.get("mating_date")
    need_check_pregnancy = request.json.get("need_check_pregnancy")
    check_if_pregnant = request.json.get("check_if_pregnant")
    has_pups = request.json.get("has_pups")

    if (need_check_pregnancy == 'None'):
        need_check_pregnancy = False
    else:
        need_check_pregnancy = True

    if (check_if_pregnant == 'on'):
        check_if_pregnant = True
    else:
        check_if_pregnant = False

    crud.create_female_mouse(female_mouse_manual_id, mating_date, has_pups, need_check_pregnancy, check_if_pregnant)

    return { "status": "The info has been added to the table" }


@app.route('/track-mice/update',  methods=['POST'])
def update_mouse_table_row():
    """Update mouse table row"""

    female_mouse_manual_id = request.json.get("female_mouse_manual_id")
    female_mouse_id = request.json.get("female_mouse_id")
    mating_date = request.json.get("mating_date")
    need_check_pregnancy = request.json.get("need_check_pregnancy")
    check_if_pregnant = request.json.get("check_if_pregnant")
    has_pups = request.json.get("has_pups")

    if (need_check_pregnancy == 'None'):
        need_check_pregnancy = False
    else:
        need_check_pregnancy = True

    if (check_if_pregnant == 'on'):
        check_if_pregnant = True
    else:
        check_if_pregnant = False

    crud.update_female_row_data(female_mouse_manual_id, female_mouse_id, mating_date, need_check_pregnancy, check_if_pregnant, has_pups)

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
