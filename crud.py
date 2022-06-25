"""CRUD operations."""

# from model import db, FemaleMouse, Pup, Litter, User, connect_to_db
from model import db, FemaleMouse, connect_to_db

def create_female_mouse(female_mouse_manual_id, mating_date, has_pups, pups_dob, pups_strain):
    """Create and return a new female mice."""

    female_mouse = FemaleMouse(
        female_mouse_manual_id = female_mouse_manual_id,
        mating_date = mating_date,
        has_pups = has_pups,
        pups_dob = pups_dob,
        pups_strain = pups_strain
    )

    db.session.add(female_mouse)
    db.session.commit()

    return female_mouse


def get_all_female_mice():
    """Return all female mice."""

    return FemaleMouse.query.all()


def get_female_row_data(mouse_id):
    """Get a female mice row data."""

    return FemaleMouse.query.filter(FemaleMouse.female_mouse_id == mouse_id).first()


def update_female_row_data(female_mouse_id, female_mouse_manual_id, mating_date, has_pups, pups_dob, pups_strain):
    """Uses id of a particular selected mouse to get the info to rewrite it"""
    
    mouse = get_female_row_data(female_mouse_id)

    if not mouse:
        raise ValueError("Mouse doesn't exist")

    mouse.female_mouse_manual_id = female_mouse_manual_id
    mouse.mating_date = mating_date
    mouse.has_pups = has_pups
    mouse.pups_dob = pups_dob
    mouse.pups_strain = pups_strain

    db.session.add(mouse)
    db.session.commit()


def delete_female_row_data(mouse_id):
    """Delete a female mice row data."""

    return FemaleMouse.query.filter(FemaleMouse.female_mouse_id == mouse_id).delete()

