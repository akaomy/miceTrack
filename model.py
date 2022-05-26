from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class FemaleMouse(db.Model):
    """A mice for breeding"""

    __tablename__ = 'femalemice'

    female_mouse_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    female_mouse_manual_id = db.Column(db.String)
    mating_date = db.Column(db.DateTime)
    has_pups = db.Column(db.Boolean)
    pups_dob = db.Column(db.DateTime)

    def __repr__(self):
        return f"""<FemaleMouse female_mouse_id={self.female_mouse_id} 
        female_mouse_manual_id={self.female_mouse_manual_id} 
        mating_date={self.mating_date} 
        has_pups={self.has_pups} 
        pups_dob={self.pups_dob} 
        >"""


def connect_to_db(flask_app, db_uri="postgresql:///miceTrack2", echo=True):
    """ connect to db """
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