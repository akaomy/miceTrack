from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Users(db.Model):
    """ Scientists """

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_email = db.Column(db.String)
    user_name = db.Column(db.String) 

    def __repr__(self):
        return f"<Users user_id={self.user_id} user_email={self.user_email} user_name={self.user_name}>"


class Litters(db.Model):
    """ Litter """

    __tablename__ = "litters"

    litter_id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    def __repr__(self):
        return f"<Litter litter_id={self.litter_id}>"


class FemaleMice(db.Model):
    """ A mice for breeding """

    female_mouse_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    litter_id = db.Column(db.String, db.ForeignKey("litters.litter_id"))
    mating_date = db.Column(db.DateTime)
    days_in_breeding = db.Column(db.Integer)
    check_pregnancy = db.Column(db.Boolean)
    pregnant = db.Column(db.Boolean)
    user_id = db.Column(db.String, db.ForeignKey("users.user_id"))

    def __repr__(self):
        return f"<FemaleMice female_mouse_id={self.female_mouse_id}>"



class Pups(db.Model):
    """ Puppies born by female mice """

    __tablename__ = "pups"

    pup_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    litter_id = db.Column(db.Integer, db.ForeignKey("litters.litter_id"))
    date_of_birth = db.Column(db.DateTime)
    days_old = db.Column(db.Integer)
    wean_date = db.Column(db.Integer)
    need_to_id = db.Column(db.Boolean)
    user_name = db.Column(db.String)

    def __repr__(self):
        return f"<Pups pups_id={self.pups_id}>"


def connect_to_db(app, db_name):
    """Connect to database."""

    app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql:///{db_name}"
    app.config["SQLALCHEMY_ECHO"] = True
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = app
    db.init_app(app)

app = Flask(__name__)

connect_to_db(app, 'micetrack')