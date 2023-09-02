import { userStore } from '../models/user-store.js';

export const accountsController = {
  login(request, response) {
    const viewData = {
      title: 'Login',
    };
    console.log('login view rendering');
    response.render('login-view', viewData);
  },

  logout(request, response) {
    response.clearCookie('user');
    response.redirect('/');
  },

  signup(request, response) {
    const viewData = {
      title: 'Signup',
    };
    console.log('signup view rendering');
    response.render('signup-view', viewData);
  },

  async register(request, response) {
    const user = request.body;
    await userStore.addUser(user);
    console.log(`registering ${user.email}`);
    response.redirect('/login');
  },

  async authenticate(request, response) {
    const user = await userStore.getUserByEmail(request.body.email);
    if (user && user.password === request.body.password) {
      response.cookie(
        'user',
        JSON.stringify({ email: user.email, password: user.password }),
      );
      response.redirect('/dashboard');
    } else {
      console.log('login view rendering');
      response.render('login-view', {
        errorMessage: 'Email or Password are wrong',
      });
    }
  },

  async getLoggedInUser(request) {
    let user;

    try {
      user = JSON.parse(request.cookies.user);
    } catch (e) {
      console.error('Failed to parse data:', e);
      return null;
    }

    if (!user) return null;

    const userEmail = user.email;
    if (!userEmail) return null;

    return await userStore.getUserByEmail(userEmail);
  },
};
