"""CRUD operations."""

from model import db, FemaleMouse, Pup, Litter, User, connect_to_db

# get user info from google sign in?
def create_user(email, name):
    """Create and return a new user."""
    
    user = User(email=email, name=name)

    return user


# def create_female_mouse(mating_date, days_in_breeding, check_pregnancy, pregnant):
#     """Create and return a new female mice."""

#     female_mouse = FemaleMouse(
#         mating_date=mating_date,
#         days_in_breeding=days_in_breeding,
#         check_pregnancy=check_pregnancy,
#         pregnant=pregnant
#     )

#     return female_mouse


# def create_pup(date_of_birth, pup_strain, days_old, wean_date, need_to_id):
#     """ Create and return pup """
    
#     pup = Pup(
#         date_of_birth=date_of_birth,
#         pup_strain=pup_strain,
#         days_old=days_old,
#         wean_date=wean_date,
#         need_to_id=need_to_id,
#     )

#     return pup

# do i need to create litter funciton?

if __name__ == "__main__":
    from server import app

    connect_to_db(app)