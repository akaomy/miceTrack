"""Server for miceTrack  app."""

from flask import (Flask, render_template, request, flash, session, redirect, send_file, make_response)
from model import connect_to_db, db
import crud
import json
import pandas as pd
from datetime import datetime 
import re
from io import BytesIO

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
        mouse_data["has_pups"] = mouse.has_pups
        mouse_data["pups_dob"] = mouse.pups_dob
        mouse_data["pups_strain"] = mouse.pups_strain
        mouse_data_list.append(mouse_data)

    return json.dumps(mouse_data_list, default=str)
    

@app.route('/track-mice/import-csv', methods=['POST'])
def import_table_data():
    """Import csv data:
    recives the file
    reads it with panda and parses only fields that are needed
    creates the new records in the db using those fileds
    sends response to notify that csv was uploaded successfully
    """
    file = request.files['file']
    dataFrame = pd.read_csv(file)
    data = dataFrame.to_records()

    for each in data:
        reg = r"(\d{4}, \d{1}, \d{2})|(\d{4}, \d{2}, \d{1})|(None)"
        match = re.search(reg, each[6])
        pups_dob = ''

        if match is not None:
            pups_dob = match.group(0)
            
            if match.group(0)=='None':
                pups_dob = '1980-01-01' # default 
        
        crud.create_female_mouse(str(each[3]), str(each[4]), bool(each[5]), pups_dob)
    
    return { "status": "File was uploaded successfully" }


@app.route('/track-mice/export-csv')
def export_table_data_as_csv():
    """Export csv data"""

    female_mice = crud.get_all_female_mice()

    mouse_data_list = []
    for mouse in female_mice:
        mouse_data = {}
        mouse_data["female_mouse_id"] = mouse.female_mouse_id
        mouse_data["female_mouse_manual_id"] = mouse.female_mouse_manual_id
        mouse_data["mating_date"] = mouse.mating_date
        mouse_data["has_pups"] = mouse.has_pups
        mouse_data["pups_dob"] = mouse.pups_dob
        mouse_data["pups_strain"] = mouse.pups_strain
        mouse_data_list.append(mouse_data)

    df = pd.DataFrame(mouse_data_list, columns = ['female_mouse_id', 'female_mouse_manual_id', 'mating_date', 'has_pups', 'pups_dob', 'pups_strain'])
    
    # same with to_excel
    resp = make_response(df.to_csv())
    resp.headers['Content-Disposition'] = 'attachment; filename=export.csv'
    resp.headers['Content-Type'] = 'text/csv'

    return resp

@app.route('/track-mice/export-xls')
def export_table_data_as_xls():
    """Export xls data"""

    female_mice = crud.get_all_female_mice()
    mouse_data_list = []
    for mouse in female_mice:
        mouse_data = {}
        mouse_data["female_mouse_id"] = mouse.female_mouse_id
        mouse_data["female_mouse_manual_id"] = mouse.female_mouse_manual_id
        # convert date into string strftime
        mouse_data["mating_date"] = mouse.mating_date
        mouse_data["has_pups"] = mouse.has_pups
        # convert date into string strftime
        mouse_data["pups_dob"] = mouse.pups_dob
        mouse_data["pups_strain"] = mouse.pups_strain
        mouse_data_list.append(mouse_data)

    df = pd.DataFrame(mouse_data_list, columns = ['female_mouse_id', 'female_mouse_manual_id', 'mating_date', 'has_pups', 'pups_dob', 'pups_strain'])
    output = BytesIO()
    writer = pd.ExcelWriter(output)
    df.to_excel(writer, startrow = 0, sheet_name = 'Sheet_1')
    writer.close()
    output.seek(0)

    return send_file(output, attachment_filename = "data.xls", as_attachment = True)


@app.route('/track-mice/create', methods=['POST'])
def create_mice_table_row():
    """Track a mice"""

    female_mouse_manual_id = request.json.get("female_mouse_manual_id")
    mating_date = request.json.get("mating_date")
    has_pups = request.json.get("has_pups")
    pups_dob = request.json.get("pups_dob")
    pups_strain = request.json.get("pups_strain")

    if (has_pups == 'on'):
        has_pups = True
    else:
        has_pups = False

    crud.create_female_mouse(female_mouse_manual_id, mating_date, has_pups, pups_dob, pups_strain)

    return { "status": "The info has been added to the table" }


@app.route('/track-mice/update',  methods=['POST'])
def update_mouse_table_row():
    """Update mouse table row"""


    female_mouse_id = request.json.get("female_mouse_id")
    female_mouse_manual_id = request.json.get("female_mouse_manual_id")
    mating_date = request.json.get("mating_date")
    has_pups = request.json.get("has_pups")
    if (has_pups == 'on'):
        has_pups = True
    else:
        has_pups = False

    pups_dob = request.json.get("pups_dob")
    pups_strain = request.json.get("pups_strain")

    crud.update_female_row_data(female_mouse_id, female_mouse_manual_id, mating_date, has_pups, pups_dob, pups_strain)

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
