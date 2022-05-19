"""CRUD operations."""

from model import db, FemaleMouse, Pup, Litter, User, connect_to_db

def create_user(email, name):
    """Create and return a new user."""
    
    user = User(email=email, name=name)

    return user


def create_female_mouse(mating_date, days_in_breeding, check_pregnancy, pregnant):
    """Create and return a new female mice."""

    female_mouse = FemaleMouse(
        mating_date=mating_date,
        days_in_breeding=days_in_breeding,
        check_pregnancy=check_pregnancy,
        pregnant=pregnant
    )

    db.session.add(female_mouse)
    db.session.commit()

    return female_mouse

def update_female_row_data(female_mouse_id, mating_date, days_in_breeding, check_pregnancy, pregnant):
    """Uses id of a particular selected mouse to get the info to rewrite it"""
    
    mouse = get_female_row_data(female_mouse_id)
    
    if not mouse:
        raise ValueError("Mouse doesn't exist")

    mouse.mating_date = mating_date
    mouse.days_in_breeding = days_in_breeding
    mouse.check_pregnancy = check_pregnancy
    mouse.pregnant = pregnant

    db.session.commit()


def get_all_female_mice():
    """Return all female mice."""

    return FemaleMouse.query.all()

def get_female_row_data(mouse_id):
    """Get a female mice row data."""

    return FemaleMouse.query.filter_by(FemaleMouse.female_mouse_id == mouse_id)

def delete_female_row_data(mouse_id):
    """Delete a female mice row data."""

    return FemaleMouse.query.filter(FemaleMouse.female_mouse_id == mouse_id).delete()


def create_pup(date_of_birth, pup_strain, days_old, wean_date, need_to_id):
    """ Create and return pup """

    pup = Pup(
        date_of_birth=date_of_birth,
        pup_strain=pup_strain,
        days_old=days_old,
        wean_date=wean_date,
        need_to_id=need_to_id,
    )

    db.session.add(pup)
    db.session.commit()

    return pup

# do i need to create litter funciton?

if __name__ == "__main__":
    from server import app

    connect_to_db(app)