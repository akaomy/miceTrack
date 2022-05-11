"""Server for miceTrack  app."""

from flask import (Flask, render_template, request, flash, session, redirect)
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined
from datetime import datetime 

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined


def calculate_pup_days_old(date_of_birth):
    """ calculates how many day passed since puppy was born """

    todaysdate = datetime.today()
    # days_old = (todaysdate - date_of_birth).days

    # print('pup DOB', date_of_birth) #2022-05-01
    print('todaysdate', todaysdate) #2022-05-04 23:40:34.639674
    # print('days old', days_old)
    
@app.route("/")
def homepage():
    """View homepage."""
    
    return render_template("homepage.html")

    # # female mice
    # mating_date = request.form.get("mating-date")
    # days_in_breeding = request.form.get("days-in-breeding")
    # need_check_pregnancy = request.form.get("need-check-pregnancy")
    # check_if_pregnant = request.form.get("check-if-pregnant")

    # if (need_check_pregnancy == 'None'):
    #     need_check_pregnancy = 'not needed'
    # else:
    #     need_check_pregnancy = 'needed'
    # if (check_if_pregnant == 'on'):
    #     check_if_pregnant = 'yes'
    # else:
    #     check_if_pregnant = 'no'
    
    # female_mouse = crud.create_female_mouse(mating_date, days_in_breeding, need_check_pregnancy, check_if_pregnant)

    # # # pups
    # # pups_stain = request.form.get("pups-stain")
    # # date_of_birth = request.form.get("date-of-birth")
    # # days_old = request.form.get("days-old")
    # # wean_date = request.form.get("wean-date")
    # # need_to_id = request.form.get("need-to-id")


    # # if (need_to_id == 'None'):
    # #     need_to_id = "not needed"
    # # else:
    # #     need_to_id = "needed"

    # # calculate_pup_days_old(date_of_birth)

    # # pup = crud.create_pup(date_of_birth, pups_stain, days_old, wean_date, need_to_id)


    # return render_template("homepage.html", female_mouse=female_mouse, pups=pups)


@app.route('/track-mice', methods=['POST'])
def display_micetrack_table():
    """Track a mice table"""

    # female mice
    mating_date = request.form.get("mating-date")
    days_in_breeding = request.form.get("days-in-breeding")
    need_check_pregnancy = request.form.get("need-check-pregnancy")
    check_if_pregnant = request.form.get("check-if-pregnant")

    if (need_check_pregnancy == 'None'):
        need_check_pregnancy = False
    else:
        need_check_pregnancy = True

    if (check_if_pregnant == 'on'):
        check_if_pregnant = True
    else:
        check_if_pregnant = False

    female_mouse = crud.create_female_mouse(mating_date, days_in_breeding, need_check_pregnancy, check_if_pregnant)

    # pups
    pups_stain = request.form.get("pups-stain")
    date_of_birth = request.form.get("date-of-birth")
    days_old = request.form.get("days-old")
    wean_date = request.form.get("wean-date")
    need_to_id = request.form.get("need-to-id")


    if (need_to_id == 'None'):
        need_to_id = False
    else:
        need_to_id = True

    calculate_pup_days_old(date_of_birth)

    pup = crud.create_pup(date_of_birth, pups_stain, days_old, wean_date, need_to_id)

    print('female_mouse', female_mouse)
    # returning an object with data about female and pup mice?
    return render_template('mice-tracking-table.html', female_mouse=female_mouse, pup=pup)


if __name__ == "__main__":
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
