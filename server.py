"""Server for miceTrack  app."""

from flask import (Flask, render_template, request, flash, session, redirect)
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined
from datetime import datetime 

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

    
@app.route("/")
def homepage():
    """View homepage."""
    
    return render_template("homepage.html")

@app.route('/track-mice', methods=['POST'])
def add_new_micetrack_table_row():
    """Track a mice table"""

    mating_date = request.json.get("mating_date")
    days_in_breeding = request.json.get("days_in_breeding")
    need_check_pregnancy = request.json.get("need_check_pregnancy")
    check_if_pregnant = request.json.get("check_if_pregnant")

    if (need_check_pregnancy == 'None'):
        need_check_pregnancy = False
    else:
        need_check_pregnancy = True

    if (check_if_pregnant == 'on'):
        check_if_pregnant = True
    else:
        check_if_pregnant = False

    crud.create_female_mouse(mating_date, days_in_breeding, need_check_pregnancy, check_if_pregnant)

    return { "status": "The info has been added to the table" }


@app.route('/track-mice')
def display_mice_micetrack_table_rows():
    """Display micetrack table """

    return render_template("homepage.html")


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
