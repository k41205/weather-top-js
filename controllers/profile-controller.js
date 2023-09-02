import { accountsController } from './accounts-controller.js';
import { userStore } from '../models/user-store.js';

export const profileController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    const viewData = {
      title: 'My Profile',
      user: loggedInUser,
    };
    console.log('profile view rendering');
    response.render('profile-view', viewData);
  },

  async updateProfile(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }

    let errorMsg;

    let firstName = loggedInUser.firstName;
    let lastName = loggedInUser.lastName;
    let email = loggedInUser.email;
    let password = loggedInUser.password;

    if (request.body.firstName.trim() !== '') {
      if (request.body.firstName.length > 12) {
        errorMsg += 'First Name must have a maximum of 12 characters. <br>';
      } else {
        firstName = request.body.firstName;
      }
    }

    if (request.body.lastName.trim() !== '') {
      if (request.body.lastName.length > 12) {
        errorMsg += 'Last Name must have a maximum of 12 characters. <br>';
      } else {
        lastName = request.body.lastName;
      }
    }

    if (request.body.email.trim() !== '') {
      email = request.body.email;
    }

    if (request.body.password.trim() !== '') {
      if (request.body.password.length > 12) {
        errorMsg += 'Password must have a maximum of 12 characters. <br>';
      } else {
        password = request.body.password;
      }
    }

    const updatedUser = {
      firstName,
      lastName,
      email,
      password,
    };
    await userStore.updateUser(loggedInUser, updatedUser);
    console.log(`updated user ${loggedInUser._id}`);
    response.redirect('/profile');
  },
};
