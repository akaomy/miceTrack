"""Server for miceTrack  app."""

from flask import (Flask, render_template, request, flash, session, redirect)
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


@app.route("/")
def homepage():
    """View homepage."""

    return render_template("homepage.html")

@app.route('/track-mice', methods=['POST'])
def display_micetrack_table():
    """Track a mice table"""

    # female mice
    mating_date = request.form.get("mating-date")
    days_in_breeding = request.form.get("days-in-breeding")
    need_check_pregnancy = request.form.get("need-check-pregnancy")
    check_if_pregnant = request.form.get("check-if-pregnant")

    if (need_check_pregnancy == 'None'):
        need_check_pregnancy = 'not needed'
    else:
        need_check_pregnancy = 'needed'
    if (check_if_pregnant == 'on'):
        check_if_pregnant = 'yes'
    else:
        check_if_pregnant = 'no'
    
    female_mouse = crud.create_female_mouse(mating_date, days_in_breeding, need_check_pregnancy, check_if_pregnant)

    # pups
    pups_stain = request.form.get("pups-stain")
    date_of_birth = request.form.get("date-of-birth")
    days_old = request.form.get("days-old")
    wean_date = request.form.get("wean-date")
    need_to_id = request.form.get("need-to-id")

    if (need_to_id == 'None'):
        need_to_id = "not needed"
    else:
        need_to_id = "needed"

    pup = crud.create_pup(date_of_birth, pups_stain, days_old, wean_date, need_to_id)

    return render_template('mice-tracking-table.html', female_mouse=female_mouse, pup=pup)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
