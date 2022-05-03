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

def connect_to_db(flask_app, db_uri="postgresql:///miceTrack", echo=True):
    """Connect to database."""

    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")


if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)